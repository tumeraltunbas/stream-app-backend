import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GoogleAuthOrchestration } from './google-auth.orchestration';
import { GOOGLE_AUTH_PREFIXES } from '../../constants/prefix';
import { GoogleOAuthReqDto } from '../../models/dto/req/google-auth';
import { GoogleOAuthResDto } from '../../models/dto/res/google-auth';
import { SecurityConfig } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../../constants/configuration';
import { Response } from 'express';

@Controller(GOOGLE_AUTH_PREFIXES.BASE)
export class GoogleAuthController {
    private readonly securityConfig: SecurityConfig;

    constructor(
        private readonly googleAuthOrchestration: GoogleAuthOrchestration,
        private readonly configService: ConfigService,
    ) {
        this.securityConfig = this.configService.get<SecurityConfig>(
            CONFIGURATION_KEYS.security,
        );
    }

    @Post(GOOGLE_AUTH_PREFIXES.CALLBACK)
    async googleOAuth(
        @Body() googleOAuthReqDto: GoogleOAuthReqDto,
        @Res() res: Response,
    ): Promise<void> {
        const { accessTokenHeaderName } = this.securityConfig.jwt;

        const googleOAuthResDto: GoogleOAuthResDto =
            await this.googleAuthOrchestration.googleOAuth(googleOAuthReqDto);

        res.status(HttpStatus.OK)
            .cookie(
                accessTokenHeaderName,
                googleOAuthResDto.authToken.accessToken,
            )
            .json({});

        return undefined;
    }
}
