import { Injectable } from '@nestjs/common';
import { JoinStreamReqDto } from '../../models/dto/req/stream';
import { Room } from '../../models/entities/room';
import { Logger } from '../../infrastructure/logger/logger.service';
import { RoomService } from '../room/room.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { ERROR_CODES } from '../../constants/error';
import { Socket } from 'socket.io';

@Injectable()
export class StreamOrchestration {
    private activeRoomOwners: Map<string, string>;

    constructor(
        private readonly logger: Logger,
        private readonly roomService: RoomService,
    ) {
        this.activeRoomOwners = new Map<string, string>();
    }

    async joinStream(
        joinStreamReqDto: JoinStreamReqDto,
        client: Socket,
    ): Promise<void> {
        const { roomId, streamKey } = joinStreamReqDto;

        if (!roomId) {
            throw new BusinessRuleError(ERROR_CODES.streamNotFound);
        }

        let room: Room = null;

        try {
            room = await this.roomService.getRoomById(roomId);
        } catch (error) {
            this.logger.error(
                'Stream Orchestration - joinStream - getRoomById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!room || !room.isActive) {
            throw new BusinessRuleError(ERROR_CODES.streamNotFound);
        }

        let isStreamOwner: boolean = false;

        if (streamKey && streamKey === room.streamKey) {
            isStreamOwner = true;
        }

        if (isStreamOwner && this.activeRoomOwners.get(room.id) !== undefined) {
            throw new BusinessRuleError(ERROR_CODES.unauthorizedAction);
        }

        const roomExist: boolean = client.rooms.has(room.id);

        if (!roomExist && isStreamOwner) {
            client.rooms.add(room.id);
        }

        client.join(room.id);

        if (isStreamOwner) {
            this.activeRoomOwners.set(room.id, client.id);
        }

        this.logger.log(
            `${client.id} ${isStreamOwner ? 'OWNER' : 'RECIPIENT'} joined to the room ${room.id}`,
        );

        if (isStreamOwner) {
            const intervalId = setInterval(() => {
                client.broadcast.to(room.id).emit('message', 'Foo');
            }, 10000);

            client.on('disconnect', () => {
                clearInterval(intervalId);
            });
        }

        return undefined;
    }
}
