import * as jwt from 'jsonwebtoken';
import config, { TokenConfig } from '../config/config';
import { GenerateTokensObj, JwtPayload } from '../models/jwt';
import crypto from 'crypto';
import { emailVerificationTokenPrefix } from '../contants/prefix';

const tokenConfig: TokenConfig = config.tokenConfig;

export const generateAccessToken = (payload: JwtPayload): string => {
    const token: string = jwt.sign(payload, tokenConfig.accessToken.secretKey, {
        expiresIn: tokenConfig.accessToken.expiresIn
    });

    return token;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    const token: string = jwt.sign(payload, tokenConfig.refreshToken.secretKey, {
        expiresIn: tokenConfig.refreshToken.expiresIn
    });

    return token;
};

export const generateAuthTokens = (payload: JwtPayload): GenerateTokensObj => {
    const accessToken: string = generateAccessToken(payload);
    const refreshToken: string = generateRefreshToken(payload);

    const tokens: GenerateTokensObj = {
        accessToken,
        refreshToken
    };

    return tokens;
};

export const generateRandomToken = (byteLength: number): string => {
    const token: string = crypto.randomBytes(byteLength).toString('hex');
    return token;
};

export const generateEmailVerificationToken = (byteLength: number): string => {
    return emailVerificationTokenPrefix + generateRandomToken(byteLength);
};
