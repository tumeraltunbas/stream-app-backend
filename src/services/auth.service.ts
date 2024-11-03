import { RegisterReqDto } from '../models/dtos/request/auth.dto';
import { User } from '../models/entities/user.model';
import * as userRepository from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import config, { SecurityConfig } from '../config/config';
import logger from '../utils/logger.util';
import { CustomError } from '../infrastructure/errors/error';
import { NextFunction } from 'express';
import HttpCodes, { StatusCodes } from 'http-status-codes';
import { InternalServerError } from '../contants/errors';
import { signToken } from '../utils/token.util';
import { JwtPayload } from '../models/jwt';
import { CreateUserResDto } from '../models/dtos/response/auth.dto';

const securityConfig: SecurityConfig = config.securityConfig;

export const createUser = async (
   registerReqDto: RegisterReqDto,
   next: NextFunction
): Promise<CreateUserResDto> => {
   const { username, email, password } = registerReqDto;
   const createUserResDto: CreateUserResDto = {};

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

      const jwt = signToken(jwtPayload);

      createUserResDto.token = jwt;
      return createUserResDto;
   } catch (error) {
      logger.error('Auth Service - createUser', { error });
      const customError = new CustomError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         HttpCodes.getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
         InternalServerError
      );

      next(customError);
   }

   return createUserResDto;
};
