import { config } from "../../config/index";

export const generateEmailVerificationTemplate = (token:string,email:string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Verify your account</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="    text-align: center;
                                        font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Researchcollab.ai account verification</h3>
                                        <p style="margin-top:0;margin-bottom:10px">We've noticed that you need to verify your Researchcollab.ai account. No worries, we've got you covered!</p>
                                        <p style="margin-top:0;margin-bottom:10px">Simply click the button below to verify your account:</p>
                                        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 33px; margin-top:20px;">
                                            <tbody>
                                                <tr>
                                                    <td align="center">
                                                        <a href="${config.frontEndUrl}/verify-email?token=${token}&email=${email}" style="background-color:#07131C;color:#fff;text-decoration:none !important;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;padding:.75em 1.5em;" target="_blank">Verify your account</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="margin-top:0;margin-bottom:10px">If you don’t verify your account within 3 hours, the link will expire.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because a verification for your Researchcollab.ai account was requested.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}

export const generateForgotEmailTemplate = (token) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                     
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Reset your password</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="    text-align: center;
                                        font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Researchcollab.ai password reset</h3>
                                        <p style="margin-top:0;margin-bottom:10px">We've noticed that you need to reset your Researchcollab.ai account password. No worries, we've got you covered!</p>
                                        <p style="margin-top:0;margin-bottom:10px">Simply click the button below to reset your password</p>
                                        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 33px; margin-top:20px;">
                                            <tbody>
                                                <tr>
                                                    <td align="center">
                                                        <a href="${config.frontEndUrl}/reset-password?token=${token}" style="background-color:#07131C;color:#fff;text-decoration:none !important;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;padding:.75em 1.5em;" target="_blank">Reset your password</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="margin-top:0;margin-bottom:10px">If you don’t forgot your password within 3 hours, the link will expire.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because a verification for your Researchcollab.ai account was requested.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}

export const generateTeamEmailTemplate = (token) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                        
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Accept your invitaiton!</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="    text-align: center;
                                        font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Researchcollab.ai account invitaion</h3>
                                        <p style="margin-top:0;margin-bottom:10px">You're just a step away from exploring all the amazing features Researchcollab.ai has to offer.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Simply click the button below to accept your invitation:</p>
                                        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 33px; margin-top:20px;">
                                            <tbody>
                                                <tr>
                                                    <td align="center">
                                                        
                                                        <a href="${config.frontEndUrl}verify-email?token=${token}&type=team" style="background-color:#07131C;color:#fff;text-decoration:none !important;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;padding:.75em 1.5em;" target="_blank">Accept Invitation</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="margin-top:0;margin-bottom:10px">If you fail to verify your account within 3 hours, the link will expire. Please reach out to your company administrator for assistance. </p>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because an invitation to join Researchcollab.ai has been sent to you.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}
export const generateDailyTipsTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Tips</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                       
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Daily Tips</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="text-align: center;font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Daily Tips for You</h3>
                                        <p style="margin-top:0;margin-bottom:10px">We hope you're enjoying your trial! Here are some tips to help you get the most out of it:</p>
                                        <ul style="margin-top:0;margin-bottom:10px;list-style-type: disc;padding-left: 20px;">
                                            <li>Tip 1: [Insert Tip]</li>
                                            <li>Tip 2: [Insert Tip]</li>
                                            <li>Tip 3: [Insert Tip]</li>
                                        </ul>
                                        <p style="margin-top:0;margin-bottom:10px">Stay tuned for more tips to help you make the most of our service!</p>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because you're currently on a trial plan.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}
export const generateTrialExpirationReminderTemplate = (timeDiff: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Expiration Reminder</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                       
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Trial Expiration Reminder</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="text-align: center;font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Reminder: Your Trial is Expiring Soon</h3>
                                        <p style="margin-top:0;margin-bottom:10px">Dear User, your trial will expire in ${timeDiff} day(s). Please consider upgrading to continue using our services without interruption.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Click the button below to upgrade your plan:</p>
                                        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 33px; margin-top:20px;">
                                            <tbody>
                                                <tr>
                                                    <td align="center">
                                                        <a href="${config.frontEndUrl}upgrade" style="background-color:#07131C;color:#fff;text-decoration:none !important;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;padding:.75em 1.5em;" target="_blank">Upgrade Now</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email as a reminder of your trial period.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}



export const generateSubscriptionPlanTemplate=(plan:string)=>{
    const planNames: Record<string, string> = {
        'free': 'Free',
        'standard_monthly': 'Monthly',
        'standard_yearly': 'Yearly',
    };
    const planName = planNames[plan] || 'Our';
    return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Subscription</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Thank You for Your Subscription!</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style="border:1px solid #e2e4e8; color: #242930;">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="text-align: center;font-size:20px;font-weight:600;line-height:1.25!important; color:#24292f!important">Welcome to the Team!</h3>
                                        <p style="margin-top:0;margin-bottom:10px">Dear User,</p>
                                        <p style="margin-top:0;margin-bottom:10px">Thank you for subscribing to our service! We're excited to have you as a part of our community. Your support helps us continue to innovate and improve.</p>
                                        <p style="margin-top:0;margin-bottom:10px">You have selected the <strong style="color:#24292f!important">${planName}</strong> plan.</p>
                                        <p style="margin-top:0;margin-bottom:10px">If you have any questions or need assistance, our support team is here to help. Feel free to reach out at any time.</p>
                                        <p style="margin-top:0;margin-bottom:10px">We're looking forward to providing you with exceptional service and making your experience with us outstanding.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Best regards,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because you recently subscribed to our service.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>

`
}

export const generateTrialExpiredTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Expired</title>
</head>
<body>
    <center>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:768px;margin-right:auto;margin-left:auto;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important">
            <tbody>
                <tr>
                    <td align="center" style="padding:16px">
                        
                        <h2 style="margin-top:8px!important;margin-bottom:0;font-size:24px;font-weight:400!important;line-height:1.25!important;">Trial Expired</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="70%" style=" border:1px solid #e2e4e8; color : #242930 ">
                            <tbody>
                                <tr>
                                    <td style="padding:24px">
                                        <h3 style="text-align: center;font-size:20px;font-weight:600;line-height:1.25!important; color :#24292f !important">Your Trial Has Expired</h3>
                                        <p style="margin-top:0;margin-bottom:10px">Dear User, your trial period has expired. To continue enjoying our services, please upgrade to a paid plan.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Click the button below to choose a plan and continue:</p>
                                        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 33px; margin-top:20px;">
                                            <tbody>
                                                <tr>
                                                    <td align="center">
                                                        <a href="${config.frontEndUrl}upgrade" style="background-color:#07131C;color:#fff;text-decoration:none !important;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;padding:.75em 1.5em;" target="_blank">Upgrade Now</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="margin-top:0;margin-bottom:10px">If you believe this is a mistake, please contact our support team for assistance.</p>
                                        <p style="margin-top:0;margin-bottom:10px">Thanks,<br>The Researchcollab.ai Team</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="text-align:center!important">
            <tbody>
                <tr>
                    <td style="padding:16px">
                        <p style="margin-top:0;margin-bottom:10px;color:#6a737d!important;font-size:14px!important;">You're receiving this email because your trial period has expired.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>
</html>`;
}
