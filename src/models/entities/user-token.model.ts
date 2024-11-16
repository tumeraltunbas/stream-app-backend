import { ObjectId } from 'mongodb';
import { USER_TOKEN_TYPES } from '../../contants/enum';
import { User } from './user.model';

export class UserToken {
    _id?: ObjectId;
    userId: ObjectId;
    token: string;
    type: USER_TOKEN_TYPES;
    createdAt: Date;
}

export class UserTokenView {
    _id: ObjectId;
    userId: ObjectId;
    token: string;
    type: USER_TOKEN_TYPES;
    createdAt: Date;
    user: User;
}
