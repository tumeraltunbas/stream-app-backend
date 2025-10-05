import { Controller, Patch, Body, Post, Req } from '@nestjs/common';
import { CHANNEL_PREFIXES } from '../../constants/prefix';
import {
    FollowChannelReqDto,
    UpdateChannelReqDto,
} from '../../models/dto/req/channel';
import { ChannelOrchestration } from './channel.orchestration';
import { CustomRequest } from '../../models/entities/request';

@Controller('channels')
export class ChannelController {
    constructor(private readonly channelOrchestration: ChannelOrchestration) {}

    @Patch(CHANNEL_PREFIXES.UPDATE)
    async updateChannel(
        @Req() req: CustomRequest,
        @Body() updateChannelReqDto: UpdateChannelReqDto,
    ): Promise<void> {
        updateChannelReqDto.channel = req.channel;
        await this.channelOrchestration.updateChannel(updateChannelReqDto);
        return undefined;
    }

    @Post(':channelId/follow')
    async followChannel(@Req() req: CustomRequest): Promise<void> {
        const followChannelReqDto: FollowChannelReqDto = {
            user: req.user,
            channel: req.channel,
        };

        await this.channelOrchestration.followChannel(followChannelReqDto);

        return undefined;
    }
}
