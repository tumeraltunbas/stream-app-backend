import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserToken } from '../../models/entities/user-token';
import { User } from '../../models/entities/user';
import { UserService } from '../user/user.service';

@Injectable()
export class MiddlewareService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    async fetchUserTokenByAccessToken(accessToken: string): Promise<UserToken> {
        return this.authService.fetchUserTokenByAccessToken(accessToken);
    }

    async updateUserTokenAccessToken(
        userTokenId: string,
        accessToken: string,
    ): Promise<void> {
        await this.authService.updateUserTokenAccessToken(
            userTokenId,
            accessToken,
        );
    }

    async fetchUserById(userId: string): Promise<User> {
        return this.userService.fetchUserById(userId);
    }
}
