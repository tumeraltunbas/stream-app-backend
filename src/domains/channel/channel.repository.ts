import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../models/entities/channel';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ChannelRepository {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
    ) {}

    async updateChannel(
        channelId: string,
        channel: Partial<Channel>,
    ): Promise<void> {
        const query: FindOptionsWhere<Channel> = {
            id: channelId,
        };

        await this.channelRepository.update(query, channel);
        return undefined;
    }
}
