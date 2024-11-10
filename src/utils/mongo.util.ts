import { ObjectId } from 'mongodb';

export const convertToObjectId = (str: string): ObjectId => {
    return new ObjectId(str);
};
