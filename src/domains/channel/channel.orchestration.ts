import { Injectable } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UpdateChannelReqDto } from '../../models/dto/req/channel';
import { ERROR_CODES } from '../../constants/error';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { Channel } from '../../models/entities/channel';
import { Logger } from '../../infrastructure/logger/logger.service';
import { isUUID } from 'class-validator';

@Injectable()
export class ChannelOrchestration {
    constructor(
        private readonly channelService: ChannelService,
        private readonly logger: Logger,
    ) {}

    async updateChannel(
        channelId: string,
        updateChannelReqDto: UpdateChannelReqDto,
    ): Promise<void> {
        const { name, biography } = updateChannelReqDto;

        if (!channelId || !isUUID(channelId)) {
            throw new BusinessRuleError(ERROR_CODES.channelNotFound);
        }

        if (!name && !biography) {
            throw new BusinessRuleError(ERROR_CODES.validationError);
        }

        const channel: Partial<Channel> = { updatedAt: new Date() };

        if (name) {
            channel['name'] = name;
        }
        if (biography) {
            channel['biography'] = biography;
        }

        try {
            await this.channelService.updateChannel(channelId, channel);
        } catch (error) {
            this.logger.error(
                'Channel orchestration - updateChannel - updateChannel',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
