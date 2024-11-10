import {
    BSON_TYPES,
    UserTokenCollection,
    UserTokenValidationTitle
} from '../../contants/database';

const UserTokenCollectionValidation = {
    validator: {
        $jsonSchema: {
            bsonType: BSON_TYPES.OBJECT,
            title: UserTokenValidationTitle,
            required: ['userId', 'refreshToken', 'createdAt'],
            properties: {
                userId: {
                    bsonType: BSON_TYPES.OBJECT_ID
                },
                refreshToken: {
                    bsonType: BSON_TYPES.STRING
                },
                createdAt: {
                    bsonType: BSON_TYPES.DATE
                }
            }
        }
    }
};

export const UserTokenCollectionValidationObj = {
    collectionName: UserTokenCollection,
    validations: UserTokenCollectionValidation
};
