import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../models/entities/room';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { RoomOrchestration } from './room.orchestration';

@Module({
    imports: [LoggerModule, TypeOrmModule.forFeature([Room])],
    providers: [RoomService, RoomRepository, RoomOrchestration],
    controllers: [RoomController],
    exports: [RoomService],
})
export class RoomModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(RoomController);
    }
}
