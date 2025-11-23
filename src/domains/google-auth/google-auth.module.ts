import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthOrchestration } from './google-auth.orchestration';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GoogleAuthService } from './google-auth.service';

@Module({
    imports: [UserModule, AuthModule],
    controllers: [GoogleAuthController],
    providers: [GoogleAuthOrchestration, GoogleAuthService],
})
export class GoogleAuthModule {}
