import { Module } from '@nestjs/common';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { StreamGateway } from './stream.gateway';

@Module({
    imports: [LoggerModule],
    providers: [StreamGateway],
})
export class StreamModule {}
