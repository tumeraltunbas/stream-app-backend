import { Collection } from 'mongodb';
import { UserTokenCollection } from '../contants/collections';
import { UserToken } from '../models/entities/user-token.model';
import * as databaseService from '../services/database.service';

let userTokenCollection: Collection<UserToken>;

databaseService.getDatabase().then((db) => {
   userTokenCollection = db.collection<UserToken>(UserTokenCollection);
});

export const insertUserToken = async (userToken: UserToken): Promise<void> => {
   await userTokenCollection.insertOne(userToken);
   return undefined;
};
