import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { JwtPayload } from '../models/jwt';

const jwtConfig = config.securityConfig.jwt;

export const signToken = (payload: JwtPayload): string => {
   const token = jwt.sign(payload, jwtConfig.secretKey, {
      expiresIn: jwtConfig.expiresIn
   });

   return token;
};
