import { Injectable } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../../models/entities/room';
import { CreateRoomReqDto } from '../../models/dto/req/room';
import { Logger } from '../../infrastructure/logger/logger.service';
import { ProcessFailureError } from '../../infrastructure/error/error';
import { CreateRoomResDto } from '../../models/dto/res/room';
import { generateStreamKey } from '../../utils/str';

@Injectable()
export class RoomOrchestration {
    constructor(
        private readonly roomService: RoomService,
        private readonly logger: Logger,
    ) {}

    async createRoom(
        createRoomReqDto: CreateRoomReqDto,
    ): Promise<CreateRoomResDto> {
        const { channel } = createRoomReqDto;

        let existingRooms: Room[] = null;

        try {
            existingRooms = await this.roomService.getRoomsByChannelId(
                channel.id,
            );
        } catch (error) {
            this.logger.error(
                'Room Orchestration - createRoom - getRoomsByChannelId',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const activeRoom: Room = existingRooms.find((room) => room.isActive);

        if (activeRoom) {
            return {
                roomId: activeRoom.id,
                streamKey: activeRoom.streamKey,
            };
        }
        const streamKey = generateStreamKey();

        const room: Room = new Room(channel, streamKey);

        try {
            room.id = await this.roomService.createRoom(room);
        } catch (error) {
            this.logger.error('Room Orchestration - createRoom - createRoom', {
                error,
            });
        }

        const createRoomResDto: CreateRoomResDto = {
            roomId: room.id,
            streamKey: room.streamKey,
        };

        return createRoomResDto;
    }
}
