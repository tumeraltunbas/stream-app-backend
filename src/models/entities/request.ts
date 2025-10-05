import { Request } from 'express';
import { User } from './user';
import { Channel } from './channel';

export interface CustomRequest extends Request {
    user: User;
    channel: Channel;
}
