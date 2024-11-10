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
import * as ERROR_CODES from '../contants/error';
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
        existingUser = await userRepository.getUserByEmailOrUsername(
            username,
            email
        );
    } catch (error) {
        logger.error(
            'Auth Service - createUser - getUserByEmailOrUsername',
            error
        );
        next(new InternalServerError());
        return undefined;
    }

    if (existingUser) {
        const customError = new CustomError(
            StatusCodes.CONFLICT,
            ERROR_CODES.UserAlreadyExist
        );

        next(customError);
        return undefined;
    }

    let salt: string = null;
    let hash: string = null;

    try {
        salt = await bcrypt.genSalt(securityConfig.password.saltLength);
        hash = await bcrypt.hash(password, salt);
    } catch (error) {
        logger.error('Auth Service - createUser - bcrypt', error);
        next(new InternalServerError());
        return undefined;
    }

    const user: User = {
        email,
        username,
        password: hash,
        isBlocked: false,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    let insertedId: string = null;

    try {
        insertedId = await userRepository.createUser(user);
    } catch (error) {
        logger.error('Auth Service - createUser - createUser', error);
        next(new InternalServerError());
        return undefined;
    }

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

    try {
        await userTokenRepository.insertUserToken(userToken);
    } catch (error) {
        logger.error('Auth Service - createUser - insertUserToken', error);
        next(new InternalServerError());
        return undefined;
    }

    const createUserResDto: CreateUserResDto = {
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };

    return createUserResDto;
};
