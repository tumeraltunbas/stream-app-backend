import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { Channel } from './channel';

@Entity(DATABASE_TABLE_NAMES.ROOMS)
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne('Channel', (channel: Channel) => channel.rooms, {
        nullable: false,
    })
    channel: Relation<Channel>;

    @Column('varchar', { nullable: false })
    streamKey: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    createdAt: string;

    constructor(channel: Channel, streamKey: string) {
        this.channel = channel;
        this.streamKey = streamKey;
    }
}
