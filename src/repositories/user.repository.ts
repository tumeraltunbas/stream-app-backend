import { Collection, Document, Filter, UpdateFilter } from 'mongodb';
import { User } from '../models/entities/user.model';
import { UserCollection, UserTokenCollection } from '../contants/database';
import * as databaseService from '../services/database.service';
import { USER_TOKEN_TYPES } from '../contants/enum';
import { convertToObjectId } from '../utils/mongo.util';

let userCollection: Collection<User> = null;

databaseService.getCollection<User>(UserCollection).then((collection) => {
    userCollection = collection;
});

export const createUser = async (user: User): Promise<string> => {
    const result = await userCollection.insertOne(user);
    return result.insertedId.toString();
};

export const getUserByEmailOrUsername = async (
    username: string,
    email: string
): Promise<User> => {
    const query: Filter<User> = { $or: [{ username }, { email }] };

    return await userCollection.findOne(query);
};

export const getUserByUsername = async (username: string): Promise<User> => {
    const query: Filter<User> = { username };

    return await userCollection.findOne(query);
};

export const updateIsEmailVerified = async (
    userId: string,
    isEmailVerified: boolean
): Promise<void> => {
    const query: Filter<User> = {
        _id: convertToObjectId(userId)
    };

    const update: UpdateFilter<User> = {
        $set: {
            isEmailVerified: isEmailVerified
        }
    };

    await userCollection.updateOne(query, update);
    return undefined;
};
