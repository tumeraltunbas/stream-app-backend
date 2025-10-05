import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { Channel } from '../../models/entities/channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelRepository } from './channel.repository';
import { ChannelOrchestration } from './channel.orchestration';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { Follow } from '../../models/entities/follow';
import { ChannelMiddleware } from '../../middlewares/channel.middleware';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { combinePath } from '../../utils/str';
import { CHANNEL_PREFIXES } from '../../constants/prefix';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, Follow]), LoggerModule],
    controllers: [ChannelController],
    providers: [ChannelService, ChannelRepository, ChannelOrchestration],
    exports: [ChannelService],
})
export class ChannelModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(ChannelController);
        consumer.apply(ChannelMiddleware).forRoutes(
            {
                path: combinePath(
                    CHANNEL_PREFIXES.BASE,
                    CHANNEL_PREFIXES.UPDATE,
                ),
                method: RequestMethod.PATCH,
            },
            {
                path: combinePath(
                    CHANNEL_PREFIXES.BASE,
                    CHANNEL_PREFIXES.FOLLOW,
                ),
                method: RequestMethod.POST,
            },
        );
    }
}
