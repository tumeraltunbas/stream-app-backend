import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../../models/entities/room';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class RoomRepository {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async insertRoom(room: Room): Promise<string> {
        const result = await this.roomRepository.insert(room);
        return result.raw?.at(0)?.id;
    }

    async getRoomsByChannelId(channelId: string): Promise<Room[]> {
        const query: FindManyOptions<Room> = {
            where: {
                channel: {
                    id: channelId,
                },
            },
        };

        return this.roomRepository.find(query);
    }
}
