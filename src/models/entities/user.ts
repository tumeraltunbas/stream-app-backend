import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import type { UserToken } from './user-token';
import type { Channel } from './channel';
import { Follow } from './follow';

@Entity(DATABASE_TABLE_NAMES.USERS)
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', select: false })
    password: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    createdAt: Date;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    updatedAt: Date;

    @OneToMany('UserToken', (userToken: UserToken) => userToken.user)
    userTokens?: Relation<UserToken>[];

    @OneToOne('Channel', (channel: Channel) => channel.user)
    channel: Relation<Channel>;

    @OneToMany('Follow', (follow: Follow) => follow.user)
    follows: Relation<Follow>[];

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
