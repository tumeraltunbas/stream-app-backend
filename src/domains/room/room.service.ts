import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from '../../models/entities/room';

@Injectable()
export class RoomService {
    constructor(private readonly roomRepository: RoomRepository) {}

    async createRoom(room: Room): Promise<string> {
        return await this.roomRepository.insertRoom(room);
    }

    async getRoomsByChannelId(channelId: string): Promise<Room[]> {
        return this.roomRepository.getRoomsByChannelId(channelId);
    }
}
