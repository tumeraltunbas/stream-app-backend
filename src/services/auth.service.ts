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
import { generateAuthTokens, generateRandomToken } from '../utils/token.util';
import * as userTokenRepository from '../repositories/user-token.repository';
import { UserToken } from '../models/entities/user-token.model';
import { convertToObjectId } from '../utils/mongo.util';
import { USER_TOKEN_TYPES } from '../contants/enum';
import * as emailUtil from '../utils/email.util';

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

    const authTokens: GenerateTokensObj = generateAuthTokens(jwtPayload);
    const emailVerificationToken: string = generateRandomToken(
        securityConfig.emailVerificationToken.byteLength
    );

    const refreshTokenDoc: UserToken = {
        userId: convertToObjectId(insertedId),
        token: authTokens.refreshToken,
        type: USER_TOKEN_TYPES.REFRESH_TOKEN,
        createdAt: new Date()
    };

    const emailVerificationTokenDoc: UserToken = {
        userId: convertToObjectId(insertedId),
        token: emailVerificationToken,
        type: USER_TOKEN_TYPES.EMAIL_VERIFICATION_TOKEN,
        createdAt: new Date()
    };

    try {
        await userTokenRepository.insertUserTokens([
            refreshTokenDoc,
            emailVerificationTokenDoc
        ]);
    } catch (error) {
        logger.error('Auth Service - createUser - insertUserTokens', error);
        next(new InternalServerError());
        return undefined;
    }

    const emailVerificationLink: string =
        emailUtil.generateEmailVerificationLink(emailVerificationToken);

    try {
        await emailUtil.sendUserVerificationEmail(
            user.username,
            user.email,
            emailVerificationLink
        );
    } catch (error) {
        logger.error('Auth Service - createUser - sendEmail', { error });
        next(new InternalServerError());
        return undefined;
    }

    const createUserResDto: CreateUserResDto = {
        success: true,
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken
    };

    return createUserResDto;
};
