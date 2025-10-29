import { Module } from '@nestjs/common';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { StreamGateway } from './stream.gateway';
import { StreamOrchestration } from './stream.orchestration';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [LoggerModule, RoomModule],
    providers: [StreamGateway, StreamOrchestration],
})
export class StreamModule {}
