import { ObjectId } from 'mongodb';
import { USER_TOKEN_TYPES } from '../../contants/enum';

export class UserToken {
    _id?: string;
    userId: ObjectId;
    token: string;
    type: USER_TOKEN_TYPES;
    createdAt: Date;
}
