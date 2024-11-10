import {
    BSON_TYPES,
    UserCollection,
    UserCollectionValidationTitle
} from '../../contants/database';

const UserCollectionValidation = {
    validator: {
        $jsonSchema: {
            bsonType: BSON_TYPES.OBJECT,
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
                    bsonType: BSON_TYPES.STRING
                },
                email: {
                    bsonType: BSON_TYPES.STRING
                },
                password: {
                    bsonType: BSON_TYPES.STRING
                },
                biography: {
                    bsonType: BSON_TYPES.STRING
                },
                profileImageUrl: {
                    bsonType: BSON_TYPES.STRING
                },
                isEmailVerified: {
                    bsonType: BSON_TYPES.BOOL
                },
                isBlocked: {
                    bsonType: BSON_TYPES.BOOL
                },
                createdAt: {
                    bsonType: BSON_TYPES.DATE
                },
                updatedAt: {
                    bsonType: BSON_TYPES.DATE
                }
            }
        }
    }
};

export const UserCollectionValidationObj = {
    collectionName: UserCollection,
    validations: UserCollectionValidation
};
