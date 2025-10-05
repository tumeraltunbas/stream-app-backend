import { Injectable } from '@nestjs/common';
import { ChannelService } from './channel.service';
import {
    FollowChannelReqDto,
    UpdateChannelReqDto,
} from '../../models/dto/req/channel';
import { ERROR_CODES } from '../../constants/error';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { Channel } from '../../models/entities/channel';
import { Logger } from '../../infrastructure/logger/logger.service';
import { Follow } from '../../models/entities/follow';

@Injectable()
export class ChannelOrchestration {
    constructor(
        private readonly channelService: ChannelService,
        private readonly logger: Logger,
    ) {}

    async updateChannel(
        updateChannelReqDto: UpdateChannelReqDto,
    ): Promise<void> {
        const { name, biography, channel } = updateChannelReqDto;

        if (!name && !biography) {
            throw new BusinessRuleError(ERROR_CODES.validationError);
        }

        const channelToUpdate: Partial<Channel> = { updatedAt: new Date() };

        if (name) {
            channelToUpdate['name'] = name;
        }
        if (biography) {
            channelToUpdate['biography'] = biography;
        }

        try {
            await this.channelService.updateChannel(
                channel.id,
                channelToUpdate,
            );
        } catch (error) {
            this.logger.error(
                'Channel orchestration - updateChannel - updateChannel',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }

    async followChannel(
        followChannelReqDto: FollowChannelReqDto,
    ): Promise<void> {
        const { user, channel } = followChannelReqDto;

        const channelOwnerId = channel.user.id;

        if (user.id === channelOwnerId) {
            throw new BusinessRuleError(ERROR_CODES.cannotFollowOwnChannel);
        }

        const follow: Follow = new Follow(user, channel);

        try {
            await this.channelService.createFollow(follow);
        } catch (error) {
            this.logger.error(
                'Channel orchestration - followChannel - createFollow',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
