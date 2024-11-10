import * as jwt from 'jsonwebtoken';
import config, { TokenConfig } from '../config/config';
import { GenerateTokensObj, JwtPayload } from '../models/jwt';

const tokenConfig: TokenConfig = config.tokenConfig;

export const generateAccessToken = (payload: JwtPayload): string => {
    const token = jwt.sign(payload, tokenConfig.accessToken.secretKey, {
        expiresIn: tokenConfig.accessToken.expiresIn
    });

    return token;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    const token = jwt.sign(payload, tokenConfig.refreshToken.secretKey, {
        expiresIn: tokenConfig.refreshToken.expiresIn
    });

    return token;
};

export const generateTokens = (payload: JwtPayload): GenerateTokensObj => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const tokens: GenerateTokensObj = {
        accessToken,
        refreshToken
    };

    return tokens;
};
