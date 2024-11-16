import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
    port: parseInt(process.env.PORT),
    databaseConfig: {
        connectionString: process.env.MONGO_CONNECTION_STRING
    },
    securityConfig: {
        password: {
            saltLength: 15
        },
        emailVerificationToken: {
            byteLength: 20
        }
    },
    tokenConfig: {
        accessToken: {
            name: process.env.ACCESS_TOKEN_NAME,
            secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        },
        refreshToken: {
            name: process.env.REFRESH_TOKEN_NAME,
            secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        },
        emailVerificationTokenExpiresIn: 1000 * 60 * 60 * 24 * 1
    },
    awsConfig: {
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    pathConfig: {
        clientBasePath: process.env.CLIENT_BASE_PATH
    },
    emailConfig: {
        defaultEmail: process.env.DEFAULT_EMAIL
    }
};

export interface Config {
    port: number;
    databaseConfig: DatabaseConfig;
    securityConfig: SecurityConfig;
    tokenConfig: TokenConfig;
    awsConfig: AwsConfig;
    pathConfig: PathConfig;
    emailConfig: EmailConfig;
}

export interface DatabaseConfig {
    connectionString: string;
}

export interface SecurityConfig {
    password: {
        saltLength: number;
    };
    emailVerificationToken: {
        byteLength: number;
    };
}

export interface TokenConfig {
    accessToken: {
        name: string;
        expiresIn: string;
        secretKey: string;
    };
    refreshToken: {
        name: string;
        expiresIn: string;
        secretKey: string;
    };
    emailVerificationTokenExpiresIn: number;
}

export interface AwsConfig {
    region: string;
    accessKey: string;
    secretAccessKey: string;
}

export interface PathConfig {
    clientBasePath: string;
}

export interface EmailConfig {
    defaultEmail: string;
}

export default config;
