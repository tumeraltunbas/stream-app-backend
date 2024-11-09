import { RegisterReqDto } from '../models/dtos/request/auth.dto';
import { User } from '../models/entities/user.model';
import * as userRepository from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import config, { SecurityConfig } from '../config/config';
import logger from '../utils/logger.util';
import {
   CustomError,
   InternalServerError
} from '../infrastructure/errors/error';
import { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as ERROR_CODES from '../contants/errors';
import { GenerateTokensObj, JwtPayload } from '../models/jwt';
import { CreateUserResDto } from '../models/dtos/response/auth.dto';
import { generateTokens } from '../utils/token.util';
import * as userTokenRepository from '../repositories/user-token.repository';
import { UserToken } from '../models/entities/user-token.model';
import { convertToObjectId } from '../utils/mongo.util';

const securityConfig: SecurityConfig = config.securityConfig;

export const createUser = async (
   registerReqDto: RegisterReqDto,
   next: NextFunction
): Promise<CreateUserResDto> => {
   const { username, email, password } = registerReqDto;

   let existingUser: User = null;

   try {
      existingUser = await userRepository.getUserByEmail(email);
   } catch (error) {
      logger.error('Auth Service - createUser - getUserByEmail', error);
      next(new InternalServerError());
   }

   if (existingUser) {
      const customError = new CustomError(
         StatusCodes.CONFLICT,
         ERROR_CODES.UserAlreadyExist
      );

      next(customError);
   }

   try {
      const salt = await bcrypt.genSalt(securityConfig.password.saltLength);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user: User = {
         email,
         username,
         password: hashedPassword,
         isBlocked: false,
         isEmailVerified: false,
         createdAt: new Date(),
         updatedAt: new Date()
      };

      const insertedId = await userRepository.createUser(user);

      const jwtPayload: JwtPayload = {
         _id: insertedId,
         email: user.email
      };

      const tokens: GenerateTokensObj = generateTokens(jwtPayload);

      const userToken: UserToken = {
         userId: convertToObjectId(insertedId),
         refreshToken: tokens.refreshToken,
         createdAt: new Date()
      };

      await userTokenRepository.insertUserToken(userToken);

      const createUserResDto: CreateUserResDto = {
         success: true,
         accessToken: tokens.accessToken,
         refreshToken: tokens.refreshToken
      };

      return createUserResDto;
   } catch (error) {
      logger.error('Auth Service - createUser', { error });
      next(new InternalServerError());
   }
};
