import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { User } from './user';
import { Channel } from './channel';

@Entity(DATABASE_TABLE_NAMES.FOLLOWS)
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('timestamp without time zone', { default: new Date() })
    createdAt: Date;

    @ManyToOne('User', (user: User) => user.follows)
    user: Relation<User>;

    @ManyToOne('Channel', (channel: Channel) => channel.follows)
    channel: Relation<Channel>;

    constructor(user: User, channel: Channel) {
        this.user = user;
        this.channel = channel;
        this.createdAt = new Date();
    }
}
