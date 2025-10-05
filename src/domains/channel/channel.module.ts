import { Module } from '@nestjs/common';
import { Channel } from '../../models/entities/channel';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
})
export class ChannelModule {}
