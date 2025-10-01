import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from '../domains/auth/auth.service';
import { SecurityConfig } from '../config/configuration';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../constants/configuration';
import { generateToken, verifyToken } from '../utils/auth';
import { TokenPayload } from '../models/entities/token';
import { Logger } from '../infrastructure/logger/logger.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserToken } from '../models/entities/user-token';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { User } from '../models/entities/user';
import { UserService } from '../domains/user/user.service';
import { CustomRequest } from '../models/entities/request';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    private readonly securityConfig: SecurityConfig;
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private readonly userService: UserService,
    ) {
        this.securityConfig = this.configService.get<SecurityConfig>(
            CONFIGURATION_KEYS.security,
        );
    }

    async use(
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const accessToken: string =
            req.cookies[this.securityConfig.jwt.accessTokenHeaderName];

        if (!accessToken) {
            throw new BusinessRuleError(ERROR_CODES.authorizationError);
        }

        let payload: TokenPayload = null;
        try {
            payload = verifyToken(accessToken);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                this.logger.warn(
                    'Jwt middleware - use - verifyToken (access token expired)',
                    {
                        error,
                    },
                );

                let userToken: UserToken = null;

                try {
                    userToken =
                        await this.authService.fetchUserTokenByAccessToken(
                            accessToken,
                        );
                } catch (error) {
                    this.logger.error(
                        'Jwt middleware - use - fetchUserTokenByAccessToken',
                        { error },
                    );
                    throw new ProcessFailureError(error);
                }

                if (!userToken) {
                    this.logger.warn('Jwt middleare - user token not found!', {
                        accessToken,
                    });
                    throw new BusinessRuleError(ERROR_CODES.authorizationError);
                }

                try {
                    payload = verifyToken(userToken.refreshToken);
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        this.logger.error(
                            'Jwt middleware - use - verifyToken (refresh token expired)',
                            {
                                error,
                            },
                        );
                        throw new BusinessRuleError(
                            ERROR_CODES.authorizationError,
                        );
                    }

                    this.logger.error('Jwt middleware - use - verifyToken', {
                        error,
                    });
                    throw new ProcessFailureError(error);
                }

                const newAccessToken: string = generateToken(
                    { sub: payload.sub },
                    this.securityConfig.jwt.accessTokenExpiresIn,
                );

                try {
                    await this.authService.updateUserTokenAccessToken(
                        userToken.id,
                        newAccessToken,
                    );
                } catch (error) {
                    this.logger.error(
                        'Jwt middleware - use - updateUserTokenAccessToken',
                        { error },
                    );
                }

                res.cookie(
                    this.securityConfig.jwt.accessTokenHeaderName,
                    newAccessToken,
                );
            } else {
                this.logger.error('Jwt middleware - use - verifyToken', {
                    error,
                });
                throw new ProcessFailureError(error);
            }
        }

        let user: User = null;

        try {
            user = await this.userService.fetchUserById(payload.sub);
        } catch (error) {
            this.logger.error('Jwt middleware - user - fetchUserById', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        if (!user) {
            throw new BusinessRuleError(ERROR_CODES.authorizationError);
        }

        req.user = user;

        next();
    }
}
