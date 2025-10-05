import { Injectable, NestMiddleware } from '@nestjs/common';
import { ChannelService } from '../domains/channel/channel.service';
import { CustomRequest } from '../models/entities/request';
import { NextFunction } from 'express';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { isUUID } from 'class-validator';
import { Channel } from '../models/entities/channel';
import { Logger } from '../infrastructure/logger/logger.service';

@Injectable()
export class ChannelMiddleware implements NestMiddleware {
    constructor(
        private readonly channelService: ChannelService,
        private readonly logger: Logger,
    ) {}

    async use(
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const channelId = req.params['channelId'];

        if (!channelId || !isUUID(channelId)) {
            throw new BusinessRuleError(ERROR_CODES.channelNotFound);
        }

        let channel: Channel = null;

        try {
            channel = await this.channelService.getChannelById(channelId);
        } catch (error) {
            this.logger.error('Channel middleware - getChannelById', { error });
            throw new ProcessFailureError(error);
        }

        if (!channel) {
            throw new BusinessRuleError(ERROR_CODES.channelNotFound);
        }

        req.channel = channel;

        next();
    }
}
