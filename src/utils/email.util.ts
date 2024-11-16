import {
    SESClient,
    SESClientConfig,
    SendEmailCommand,
    SendEmailCommandInput
} from '@aws-sdk/client-ses';
import config, { AwsConfig, EmailConfig, PathConfig } from '../config/config';
import { generateEmailVerificationContent } from '../contants/email';

const awsConfig: AwsConfig = config.awsConfig;
const emailConfig: EmailConfig = config.emailConfig;
const pathConfig: PathConfig = config.pathConfig;

const sesClientConfig: SESClientConfig = {
    region: awsConfig.region,
    credentials: {
        accessKeyId: awsConfig.accessKey,
        secretAccessKey: awsConfig.secretAccessKey
    }
};

const sesClient: SESClient = new SESClient(sesClientConfig);

const sendEmail = async (
    sendEmailCommandInput: SendEmailCommandInput
): Promise<void> => {
    const sendEmailCommandEmail = new SendEmailCommand(sendEmailCommandInput);
    await sesClient.send(sendEmailCommandEmail);
};

export const sendUserVerificationEmail = async (
    username: string,
    targetEmail: string,
    emailVerificationLink: string
): Promise<void> => {
    const emailContent = generateEmailVerificationContent(
        username,
        emailVerificationLink
    );

    const sendEmailCommandInput: SendEmailCommandInput = {
        Source: emailConfig.defaultEmail,
        Destination: {
            ToAddresses: [targetEmail]
        },
        Message: {
            Body: {
                Html: { Data: emailContent.htmlBody }
            },
            Subject: {
                Data: emailContent.subject
            }
        }
    };

    await sendEmail(sendEmailCommandInput);
};

export const generateEmailVerificationLink = (
    emailVerificationToken: string
): string => {
    const verificationPath = '/auth/email/verify';
    const queryParameter = `?emailVerificationToken=${emailVerificationToken}`;

    return pathConfig.clientBasePath + verificationPath + queryParameter;
};
