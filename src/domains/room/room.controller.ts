import { Controller, Post, Req } from '@nestjs/common';
import { CustomRequest } from '../../models/entities/request';
import { CreateRoomResDto } from '../../models/dto/res/room';
import { CreateRoomReqDto } from '../../models/dto/req/room';
import { RoomOrchestration } from './room.orchestration';
import { ROOM_PREFIXES } from '../../constants/prefix';

@Controller(ROOM_PREFIXES.BASE)
export class RoomController {
    constructor(private readonly roomOrchestration: RoomOrchestration) {}

    @Post()
    async createRoom(@Req() req: CustomRequest): Promise<CreateRoomResDto> {
        const createRoomReqDto: CreateRoomReqDto = {
            channel: req.user.channel,
        };

        return await this.roomOrchestration.createRoom(createRoomReqDto);
    }
}
