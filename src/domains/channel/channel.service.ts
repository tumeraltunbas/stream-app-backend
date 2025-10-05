import { Injectable } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { Channel } from '../../models/entities/channel';
import { Follow } from '../../models/entities/follow';

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

    async createFollow(follow: Follow): Promise<void> {
        await this.channelRepository.createFollow(follow);
        return undefined;
    }

    async getChannelById(channelId: string): Promise<Channel> {
        return await this.channelRepository.getChannelById(channelId);
    }

    async removeFollow(userId: string, channelId: string): Promise<void> {
        await this.channelRepository.removeFollow(userId, channelId);
        return undefined;
    }
}
