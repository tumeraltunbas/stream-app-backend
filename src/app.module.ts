import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule, loadTypeOrmModule } from './utils/module-loader';
import { AuthModule } from './domains/auth/auth.module';
import { ChannelModule } from './domains/channel/channel.module';
import { MiddlewareModule } from './domains/middleware/middleware.module';

@Module({
    imports: [
        LoggerModule,
        loadConfigModule(),
        loadTypeOrmModule(),
        AuthModule,
        ChannelModule,
        MiddlewareModule,
    ],
})
export class AppModule {}
