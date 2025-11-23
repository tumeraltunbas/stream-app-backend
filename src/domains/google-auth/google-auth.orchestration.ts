import { Injectable } from '@nestjs/common';
import { GoogleOAuthReqDto } from '../../models/dto/req/google-auth';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { ERROR_CODES } from '../../constants/error';
import { Logger } from '../../infrastructure/logger/logger.service';
import { GoogleAuthService } from './google-auth.service';
import { TokenPayload } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { User } from '../../models/entities/user';
import { Channel } from '../../models/entities/channel';
import { generateChannelNameFromEmail } from '../../utils/str';
import { DataSource } from 'typeorm';
import { JwtTokenPayload } from '../../models/entities/token';
import { generateAuthTokens } from '../../utils/auth';
import { UserToken } from '../../models/entities/user-token';
import { AuthService } from '../auth/auth.service';
import { GoogleOAuthResDto } from '../../models/dto/res/google-auth';

@Injectable()
export class GoogleAuthOrchestration {
    constructor(
        private readonly logger: Logger,
        private readonly googleAuthService: GoogleAuthService,
        private readonly userService: UserService,
        private readonly dataSource: DataSource,
        private readonly authService: AuthService,
    ) {}

    async googleOAuth(
        googleOAuthReqDto: GoogleOAuthReqDto,
    ): Promise<GoogleOAuthResDto> {
        const { credential } = googleOAuthReqDto;

        let tokenPayload: TokenPayload = null;

        try {
            tokenPayload = await this.googleAuthService.verifyToken(credential);
        } catch (error) {
            this.logger.error(
                'Google Auth Orchestration - googleOAuth - getOpenIdToken',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!tokenPayload) {
            throw new BusinessRuleError(ERROR_CODES.tokenPayloadNotRetrieved);
        }

        const email: string = tokenPayload.email;

        let user: User = null;

        try {
            user = await this.userService.fetchUserByEmail(email);
        } catch (error) {
            this.logger.error(
                'Google Auth Orchestration - googleOAuth - fetchUserByEmail',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (user?.password) {
            throw new BusinessRuleError(ERROR_CODES.googleSignInNotAllowed);
        }

        if (!user) {
            const channelName: string = generateChannelNameFromEmail(email);
            const newUser = new User(email, null);
            const channel = new Channel(channelName, newUser);

            try {
                await this.dataSource.transaction(async (manager) => {
                    try {
                        user = await manager.save<User>(newUser);
                    } catch (error) {
                        this.logger.error(
                            'Google Auth Orchestration - googleOAuth - insertUser',
                            {
                                error,
                            },
                        );
                        throw new ProcessFailureError(error);
                    }

                    try {
                        await manager.save<Channel>(channel);
                    } catch (error) {
                        this.logger.error(
                            'Google Auth Orchestration - googleOAuth - insertChannel',
                            { error },
                        );
                        throw new ProcessFailureError(error);
                    }
                });
            } catch (error) {
                this.logger.error(
                    'Google Auth Orchestration - googleOAuth - transaction error',
                    {
                        error,
                    },
                );
                throw new ProcessFailureError(error);
            }
        }

        const payload: JwtTokenPayload = {
            sub: user.id,
        };

        const authToken = generateAuthTokens(payload);

        const userToken: UserToken = new UserToken(
            user,
            authToken.accessToken,
            authToken.refreshToken,
        );

        try {
            await this.authService.insertUserToken(userToken);
        } catch (error) {
            this.logger.error('Auth orchestration - login - insertUserToken', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        const googleOAuthResDto: GoogleOAuthResDto = {
            authToken,
        };

        return googleOAuthResDto;
    }
}
