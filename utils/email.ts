import axios from 'axios';
import { AppError, handleError } from '../utils/erroHandler';
import { MESSEGES } from '../constants/index';
import {
    generateEmailVerificationTemplate,
    generateForgotEmailTemplate,
    generateDailyTipsTemplate,
    generateTrialExpirationReminderTemplate,
    generateTrialExpiredTemplate,
    generateTeamEmailTemplate,
    generateSubscriptionPlanTemplate
} from './templates/email';
import { config } from '../config';

const apiKey = config.email.apiKey;
const userKey = config.email.userKey;
const apiUrl = config.email.apiUrl;

// console.log(apiKey, userKey, apiUrl);

const templates: Record<string, (token: string,email:string,plan?: string) => string> = {
    accountVerification: generateEmailVerificationTemplate,
    accountForgotPassword: generateForgotEmailTemplate,
    accountTeamEmailVerification: generateTeamEmailTemplate,
    dailyTip: generateDailyTipsTemplate,
    trialExpirationReminder: generateTrialExpirationReminderTemplate,
    trialExpired: generateTrialExpiredTemplate,
    subscriptionPlan:generateSubscriptionPlanTemplate
};

const subjects: Record<string, string> = {
    accountVerification: MESSEGES.VERIFICATION_EMAIL_SUBJECT,
    accountForgotPassword: MESSEGES.VERIFICATION_FORGOT_SUBJECT,
    accountTeamEmailVerification: MESSEGES.VERIFICATION_TEAM_SUBJECT,
    dailyTip: MESSEGES.DAILY_TIPS_SUBJECT,
    trialExpirationReminder: MESSEGES.TRIAL_EXPIRATION_REMAINDER_SUBJECT,
    trialExpired: MESSEGES.TRIAL_EXPIRED_SUBJECT,
    subscriptionPlan:MESSEGES.SUBSCRIPTION_PLAN
};

type TemplateName = 'accountVerification' | 'dailyTip' | 'trialExpirationReminder' | 'trialExpired' | 'accountForgotPassword' | 'accountTeamEmailVerification' |'subscriptionPlan';

export const sendVerificationEmail = async (
    email: string,
    resetToken: string = 'reset key...',
    templateName: TemplateName,
    next: (error: any) => void
): Promise<any> => {
    try {
        const func = templates[templateName];
        const subject = subjects[templateName];
        const html = func(resetToken,email);

        const response = await axios.post(apiUrl, {
            UserKey: userKey,
            ToEmail: email,
            Subject: subject,
            SenderEmail:  "service@researchcollab.ai",
            SenderName: 'ResearchCollab',
            SubmittedContent: html,
        }, {
            headers: {
                'ApiKey': apiKey,
                'Content-Type': 'application/json'
            }
        });


        return response.data;
    } catch (err) {
        console.error('Error sending email:', err);
        if (err.response) {
            console.error('Enginemailer response:', err.response.data);
        }
        const { statusCode, message } = handleError(err);
        if (statusCode === 403) {
            console.error('Authorization error. Please check your API key and permissions.');
        }
        throw new AppError(message, statusCode);
    }
};

export const sendEmail = async (
    email: string,
    templateName: TemplateName,
    timeDiff?: number,
    plan?: string
): Promise<any> => {
    try {
        const func = templates[templateName];
        const subject = subjects[templateName];
        const html = func(timeDiff !== undefined ? timeDiff.toString() : '',email, plan !== undefined ? plan.toString() : '');

        const response = await axios.post(apiUrl, {
            UserKey: userKey,
            ToEmail: email,
            Subject: subject,
            SenderEmail: 'service@researchcollab.ai',
            SenderName: 'ResearchCollab',
            SubmittedContent: html,
        }, {
            headers: {
                'ApiKey': apiKey,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (err) {
        console.error('Error sending email:', err);
        if (err.response) {
            console.error('Enginemailer response:', err.response.data);
        }
        const { statusCode, message } = handleError(err);
        if (statusCode === 403) {
            console.error('Authorization error. Please check your API key and permissions.');
        }
        throw new AppError(message, statusCode);
    }
};
