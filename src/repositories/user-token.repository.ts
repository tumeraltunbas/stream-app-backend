import { Collection } from 'mongodb';
import { UserToken } from '../models/entities/user-token.model';
import * as databaseService from '../services/database.service';
import { UserTokenCollection } from '../contants/database';

let userTokenCollection: Collection<UserToken> = null;

databaseService.getCollection<UserToken>(UserTokenCollection).then((collection) => {
    userTokenCollection = collection;
});

export const insertUserToken = async (userToken: UserToken): Promise<void> => {
    await userTokenCollection.insertOne(userToken);
    return undefined;
};

export const insertUserTokens = async (userTokens: UserToken[]): Promise<void> => {
    await userTokenCollection.insertMany(userTokens);
    return undefined;
};
