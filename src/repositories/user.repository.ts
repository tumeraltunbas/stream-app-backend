import { Collection, Filter } from 'mongodb';
import { User } from '../models/entities/user.model';
import { UserCollection } from '../contants/database';
import * as databaseService from '../services/database.service';

let userCollection: Collection<User> = null;

databaseService.getCollection<User>(UserCollection).then((collection) => {
    userCollection = collection;
});

export const createUser = async (user: User): Promise<string> => {
    const result = await userCollection.insertOne(user);
    return result.insertedId;
};

export const getUserByEmailOrUsername = async (
    username: string,
    email: string
): Promise<User> => {
    const query: Filter<User> = { $or: [{ username }, { email }] };

    return await userCollection.findOne(query);
};
