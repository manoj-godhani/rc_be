import cron from 'node-cron';
import { sendEmail } from './email';
import supabase from '../services/db/supabase';
import { io } from '../index';
import { AppError } from './erroHandler';
import { checkSubscriptionTime } from '../services/user/userServices';
import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';

interface User {
    id: string;
    email: string;
    subscription_plan: string;
    billingCycleEndDate: string;
}

async function sendDailyTips(): Promise<void> {
    try {
        const response: PostgrestResponse<{email: string;}>= await supabase.getClient()
            .from('users')
            .select('email')
            .eq('subscription_plan', 'free');
            const { data: users, error } = response;
        if (error) {
            console.error('Error fetching users:', error.message);
            return;
        }

        if (!users || users.length === 0) {
            console.warn('No users found with free subscription plan.');
            return;
        }
        for (const user of users) {
            try {
                await sendEmail(user.email, 'dailyTip');
                if (io) {
                    io.emit('subscriptionNotification', { user: user?.email, message: 'Daily tip sent' });
                }
                const { data, error } = await supabase.getClient().from('notification')
                    .insert([
                        {
                            owner_email: user.email,
                            notification_type:'subscription_notification',
                            message: 'Daily tip sent'
                        }
                    ])
                    .select();

                if (error) {
                    throw new AppError(error.message, 500);
                }

            } catch (err: unknown) {
                console.error(`Error sending daily tips to ${user.email}:`, (err as Error).message);
            }
        }
    } catch (err: unknown) {
        console.error('Error in sendDailyTips function:', (err as Error).message);
    }
}

async function checkTrials(): Promise<void> {
    try {
        const { data: users, error }: PostgrestResponse<User> = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('subscription_plan', 'free');

        if (error) {
            console.error('Error fetching users:', error.message);
            return;
        }

        if (!users || users.length === 0) {
            console.warn('No users found with free subscription plan.');
            return;
        }

        const currentDate: Date = new Date();

        for (const user of users) {
            try {
                
                const userSubscriptionTime = await checkSubscriptionTime(user?.id);

                const trialEndDate: Date = new Date(userSubscriptionTime?.billingCycleEndDate);

                const timeDiff: number = Math.ceil((trialEndDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
                

                
                if (timeDiff === 7 || timeDiff === 3 || timeDiff === 1) {
                  
                    await sendEmail(user.email, 'trialExpirationReminder', timeDiff);
                  
                    if (io) {
                        io.to(user.id).emit('subscriptionNotification', { message: `Your trial is expiring in ${timeDiff} days.` });
                    }
                    const { data, error } = await supabase.getClient().from('notification')
                    .insert([
                        {
                            owner_email: user.email,
                            notification_type:'subscription_notification',
                            message: 'Daily tip sent'
                        }
                    ])
                    .select();

                if (error) {
                    throw new AppError(error.message, 500);
                }
                }

                if (timeDiff <= 0) {
                    await supabase.getClient()
                        .from('users')
                        .update({ subscription_plan: 'expired' })
                        .eq('id', user.id);

                    await sendEmail(user.email, 'trialExpired');
                    if (io) {
                        io.to(user.id).emit('subscriptionNotification', { message: 'Your trial has expired. Please update your subscription.' });
                    }
                }
            } catch (err: unknown) {
                console.error(`Error processing user ${user.email}:`, (err as Error).message);
            }
        }
    } catch (err: unknown) {
        console.error('Error in checkTrials function:', (err as Error).message);
    }
}

// export const subscribeCronJob = () => {
//     const intervalInSeconds = 90;

//         const job = async () => {
//         console.log('Running job');
//       //  await sendDailyTips();
//         await checkTrials();
//     };

//     job();
//     setInterval(job, intervalInSeconds * 1000);
// }

// Uncomment to use node-cron scheduler instead of setInterval
export const subscribeCronJob = () => {
    cron.schedule('0 0 * * *', () => {
        sendDailyTips(); 
        checkTrials();
    }, {
        scheduled: true,
        timezone: 'America/New_York'
    });
}
