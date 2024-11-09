import { UserCollection } from '../../contants/collections';
import { bsonTypes, UserCollectionValidationTitle } from '../../contants/db';

const UserCollectionValidation = {
   validator: {
      $jsonSchema: {
         bsonType: bsonTypes.OBJECT,
         title: UserCollectionValidationTitle,
         required: [
            'username',
            'email',
            'password',
            'isEmailVerified',
            'isBlocked',
            'createdAt',
            'updatedAt'
         ],
         properties: {
            username: {
               bsonType: bsonTypes.STRING
            },
            email: {
               bsonType: bsonTypes.STRING
            },
            password: {
               bsonType: bsonTypes.STRING
            },
            biography: {
               bsonType: bsonTypes.STRING
            },
            profileImageUrl: {
               bsonType: bsonTypes.STRING
            },
            isEmailVerified: {
               bsonType: bsonTypes.BOOL
            },
            isBlocked: {
               bsonType: bsonTypes.BOOL
            },
            createdAt: {
               bsonType: bsonTypes.DATE
            },
            updatedAt: {
               bsonType: bsonTypes.DATE
            }
         }
      }
   }
};

export const UserCollectionValidationObj = {
   collectionName: UserCollection,
   validations: UserCollectionValidation
};
