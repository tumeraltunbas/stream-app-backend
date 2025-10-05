import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Channel } from '../../models/entities/channel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelRepository } from './channel.repository';
import { ChannelOrchestration } from './channel.orchestration';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
    controllers: [ChannelController],
    providers: [ChannelService, ChannelRepository, ChannelOrchestration],
})
export class ChannelModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(ChannelController);
    }
}
