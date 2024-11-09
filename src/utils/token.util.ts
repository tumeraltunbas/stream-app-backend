import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { GenerateTokensObj, JwtPayload } from '../models/jwt';

const accessTokenConfig = config.securityConfig.accessToken;
const refreshTokenConfig = config.securityConfig.refreshToken;

export const generateAccessToken = (payload: JwtPayload): string => {
   const token = jwt.sign(payload, accessTokenConfig.secretKey, {
      expiresIn: accessTokenConfig.expiresIn
   });

   return token;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
   const token = jwt.sign(payload, refreshTokenConfig.secretKey, {
      expiresIn: refreshTokenConfig.expiresIn
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
