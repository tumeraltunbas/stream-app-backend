import { Injectable } from '@nestjs/common';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { GoogleConfig } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../../constants/configuration';

@Injectable()
export class GoogleAuthService {
    private readonly googleOAuthCLient: OAuth2Client;
    private readonly googleConfig: GoogleConfig;

    constructor(private readonly configService: ConfigService) {
        this.googleConfig = this.configService.get<GoogleConfig>(
            CONFIGURATION_KEYS.google,
        );
        this.googleOAuthCLient = new OAuth2Client({
            client_id: this.googleConfig.auth.clientId,
            client_secret: this.googleConfig.auth.clientSecret,
            redirectUri: this.googleConfig.auth.redirectUri,
        });
    }

    async verifyToken(openIdToken: string): Promise<TokenPayload> {
        const loginTicket: LoginTicket =
            await this.googleOAuthCLient.verifyIdToken({
                idToken: openIdToken,
            });

        const tokenPayload: TokenPayload = loginTicket.getPayload();
        return tokenPayload;
    }
}
