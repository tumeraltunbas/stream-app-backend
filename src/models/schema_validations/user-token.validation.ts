import { UserTokenCollection } from '../../contants/collections';
import { bsonTypes, UserTokenValidationTitle } from '../../contants/db';

const UserTokenCollectionValidation = {
   validator: {
      $jsonSchema: {
         bsonType: bsonTypes.OBJECT,
         title: UserTokenValidationTitle,
         required: ['userId', 'refreshToken', 'createdAt'],
         properties: {
            userId: {
               bsonType: bsonTypes.OBJECT_ID
            },
            refreshToken: {
               bsonType: bsonTypes.STRING
            },
            createdAt: {
               bsonType: bsonTypes.DATE
            }
         }
      }
   }
};

export const UserTokenCollectionValidationObj = {
   collectionName: UserTokenCollection,
   validations: UserTokenCollectionValidation
};
