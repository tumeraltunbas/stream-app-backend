import { Global, Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChannelModule } from '../channel/channel.module';

@Global()
@Module({
    imports: [AuthModule, UserModule, ChannelModule],
    providers: [MiddlewareService],
    exports: [MiddlewareService],
})
export class MiddlewareModule {}
