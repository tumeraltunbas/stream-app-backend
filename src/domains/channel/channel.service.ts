import { Injectable } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { Channel } from '../../models/entities/channel';

@Injectable()
export class ChannelService {
    constructor(private readonly channelRepository: ChannelRepository) {}

    async updateChannel(
        channelId: string,
        channel: Partial<Channel>,
    ): Promise<void> {
        await this.channelRepository.updateChannel(channelId, channel);
        return undefined;
    }
}
