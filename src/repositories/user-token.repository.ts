import { Collection, Document, Filter } from 'mongodb';
import { UserToken, UserTokenView } from '../models/entities/user-token.model';
import * as databaseService from '../services/database.service';
import { UserCollection, UserTokenCollection } from '../contants/database';
import { USER_TOKEN_TYPES } from '../contants/enum';
import { User } from '../models/entities/user.model';
import { convertToObjectId } from '../utils/mongo.util';

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

export const getUserByToken = async (
    tokenType: USER_TOKEN_TYPES,
    token: string
): Promise<UserTokenView> => {
    const aggregation: Document[] = [
        {
            $match: { type: tokenType, token: token }
        },
        {
            $lookup: {
                from: UserCollection,
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        }
    ];

    const response = await userTokenCollection
        .aggregate<UserTokenView>(aggregation)
        .toArray();

    return response[0];
};

export const removeUserToken = async (userTokenId: string): Promise<void> => {
    const query: Filter<UserToken> = {
        _id: convertToObjectId(userTokenId)
    };

    await userTokenCollection.deleteOne(query);
    return undefined;
};
