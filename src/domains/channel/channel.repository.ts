import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../models/entities/channel';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Follow } from '../../models/entities/follow';

@Injectable()
export class ChannelRepository {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
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

    async createFollow(follow: Follow): Promise<void> {
        await this.followRepository.insert(follow);
        return undefined;
    }

    async getChannelById(channelId: string): Promise<Channel> {
        const query: FindOneOptions<Channel> = {
            where: {
                id: channelId,
            },
            relations: {
                user: true,
            },
        };

        return await this.channelRepository.findOne(query);
    }
}
