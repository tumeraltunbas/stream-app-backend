import { ObjectId } from 'mongodb';

export class UserToken {
   _id?: string;
   userId: ObjectId;
   refreshToken: string;
   createdAt: Date;
}
