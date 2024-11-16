import { LoginReqDto, RegisterReqDto } from '../models/dtos/request/auth.dto';
import { User } from '../models/entities/user.model';
import * as userRepository from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import config, { SecurityConfig } from '../config/config';
import logger from '../utils/logger.util';
import {
    BusinessRuleError,
    InternalServerError
} from '../infrastructure/errors/error';
import { NextFunction } from 'express';
import * as ERROR_CODES from '../contants/error';
import { GenerateTokensObj, JwtPayload } from '../models/jwt';
import { CreateUserResDto, LoginResDto } from '../models/dtos/response/auth.dto';
import * as userTokenRepository from '../repositories/user-token.repository';
import { UserToken } from '../models/entities/user-token.model';
import { convertToObjectId } from '../utils/mongo.util';
import { USER_TOKEN_TYPES } from '../contants/enum';
import * as emailUtil from '../utils/email.util';
import * as tokenUtil from '../utils/token.util';
import { ServiceResponse } from '../models/dtos/response';

const securityConfig: SecurityConfig = config.securityConfig;

export const createUser = async (
    registerReqDto: RegisterReqDto,
    next: NextFunction
): Promise<ServiceResponse<CreateUserResDto>> => {
    const { username, email, password } = registerReqDto;

    let existingUser: User = null;

    try {
        existingUser = await userRepository.getUserByEmailOrUsername(
            username,
            email
        );
    } catch (error) {
        logger.error('Auth Service - createUser - getUserByEmailOrUsername', error);
        return next(new InternalServerError());
    }

    if (existingUser) {
        next(new BusinessRuleError(ERROR_CODES.UserAlreadyExist));
        return undefined;
    }

    let salt: string = null;
    let hash: string = null;

    try {
        salt = await bcrypt.genSalt(securityConfig.password.saltLength);
        hash = await bcrypt.hash(password, salt);
    } catch (error) {
        logger.error('Auth Service - createUser - bcrypt', error);
        return next(new InternalServerError());
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
        return next(new InternalServerError());
    }

    const jwtPayload: JwtPayload = {
        _id: insertedId,
        email: user.email
    };

    const authTokens: GenerateTokensObj = tokenUtil.generateAuthTokens(jwtPayload);
    const emailVerificationToken: string = tokenUtil.generateEmailVerificationToken(
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
        return next(new InternalServerError());
    }

    const emailVerificationLink: string = emailUtil.generateEmailVerificationLink(
        emailVerificationToken
    );

    try {
        await emailUtil.sendUserVerificationEmail(
            user.username,
            user.email,
            emailVerificationLink
        );
    } catch (error) {
        logger.error('Auth Service - createUser - sendEmail', { error });
        return next(new InternalServerError());
    }

    const createUserResDto: CreateUserResDto = {
        success: true,
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken
    };

    return createUserResDto;
};

export const login = async (
    loginReqDto: LoginReqDto,
    next: NextFunction
): Promise<ServiceResponse<LoginResDto>> => {
    const { username, password } = loginReqDto;

    let user: User = null;

    try {
        user = await userRepository.getUserByUsername(username);
    } catch (error) {
        logger.error('Auth Service - login - getUserByUsername', { error });
        return next(new InternalServerError());
    }

    if (!user) {
        return next(new BusinessRuleError(ERROR_CODES.InvalidCredentials));
    }

    if (user.isBlocked) {
        return next(new BusinessRuleError(ERROR_CODES.UserBlocked));
    }

    let isCredentialsValid: boolean = false;

    try {
        isCredentialsValid = await bcrypt.compare(password, user.password);
    } catch (error) {
        logger.error('Auth Service - login - bcrypt compare', { error });
        return next(new InternalServerError());
    }

    if (!isCredentialsValid) {
        return next(new BusinessRuleError(ERROR_CODES.InvalidCredentials));
    }

    const tokens: GenerateTokensObj = tokenUtil.generateAuthTokens({
        _id: user._id,
        email: user.email
    });

    const refreshTokenDoc: UserToken = {
        userId: convertToObjectId(user._id),
        token: tokens.refreshToken,
        type: USER_TOKEN_TYPES.REFRESH_TOKEN,
        createdAt: new Date()
    };

    try {
        await userTokenRepository.insertUserToken(refreshTokenDoc);
    } catch (error) {
        logger.error('Auth Service - login - insertUserToken', { error });
        return next(new InternalServerError());
    }

    const loginResDto: LoginResDto = {
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };

    return loginResDto;
};
