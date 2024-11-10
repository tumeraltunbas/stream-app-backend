export interface EmailContent {
    subject: string;
    htmlBody: string;
}

export const generateEmailVerificationContent = (
    username: string,
    emailVerificationLink: string
): EmailContent => {
    return {
        subject: 'Email Verification',
        htmlBody: `
        <p>Hello, ${username}!</p>
        <p>Thank you for registering with us. To complete your registration and verify your email address, please click the link below:</p>
        <p><a href="${emailVerificationLink}">Verify My Email</a></p>
        <p>If you didn't register for an account, you can safely ignore this email.</p>
        <p>StreamApp Team</p>
        `
    };
};
