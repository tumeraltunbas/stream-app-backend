import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule, loadTypeOrmModule } from './utils/module-loader';
import { AuthModule } from './domains/auth/auth.module';
import { ChannelModule } from './domains/channel/channel.module';
import { MiddlewareModule } from './domains/middleware/middleware.module';
import { StreamModule } from './domains/stream/stream.module';
import { RoomModule } from './domains/room/room.module';
import { GoogleAuthModule } from './domains/google-auth/google-auth.module';

@Module({
    imports: [
        LoggerModule,
        loadConfigModule(),
        loadTypeOrmModule(),
        AuthModule,
        ChannelModule,
        MiddlewareModule,
        StreamModule,
        RoomModule,
        GoogleAuthModule,
    ],
})
export class AppModule {}
