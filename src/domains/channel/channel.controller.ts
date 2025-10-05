import { Controller, Param, Patch, Body } from '@nestjs/common';
import { CHANNEL_PREFIXES } from '../../constants/prefix';
import { UpdateChannelReqDto } from '../../models/dto/req/channel';
import { ChannelOrchestration } from './channel.orchestration';

@Controller(CHANNEL_PREFIXES.BASE)
export class ChannelController {
    constructor(private readonly channelOrchestration: ChannelOrchestration) {}

    @Patch(':channelId')
    async updateChannel(
        @Param('channelId') channelId: string,
        @Body() updateChannelReqDto: UpdateChannelReqDto,
    ): Promise<void> {
        await this.channelOrchestration.updateChannel(
            channelId,
            updateChannelReqDto,
        );
        return undefined;
    }
}
