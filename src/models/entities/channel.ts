import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    Relation,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import type { User } from './user';

@Entity(DATABASE_TABLE_NAMES.CHANNELS)
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar', { nullable: true })
    biography?: string;

    @Column('varchar', { nullable: true })
    photoUrl: string;

    @Column('varchar', { nullable: true })
    bannerUrl: string;

    @Column('timestamp without time zone', { default: new Date() })
    createdAt: Date;

    @Column('timestamp without time zone', { default: new Date() })
    updatedAt: Date;

    @OneToOne('User', (user: User) => user.channel, { nullable: false })
    @JoinColumn()
    user: Relation<User>;

    constructor(name: string, user: User) {
        this.name = name;
        this.user = user;
    }
}
