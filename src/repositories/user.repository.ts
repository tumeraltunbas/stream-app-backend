import { Collection, Filter } from 'mongodb';
import { User } from '../models/entities/user.model';
import { UserCollection } from '../contants/collections';
import * as databaseService from '../services/database.service';

let userCollection: Collection<User>;

databaseService.getDatabase().then((db) => {
   userCollection = db.collection<User>(UserCollection);
});

export const createUser = async (user: User): Promise<string> => {
   const result = await userCollection.insertOne(user);
   return result.insertedId;
};

export const getUserByEmail = async (email: string): Promise<User> => {
   const query: Filter<User> = {
      email: email
   };

   return await userCollection.findOne(query);
};
