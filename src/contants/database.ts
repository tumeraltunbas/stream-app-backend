export enum BSON_TYPES {
    DOUBLE = 'double',
    STRING = 'string',
    OBJECT = 'object',
    ARRAY = 'array',
    BINARY = 'binary',
    UNDEFINED = 'undefined',
    OBJECT_ID = 'objectId',
    BOOL = 'bool',
    DATE = 'date',
    NULL = 'null',
    SYMBOL = 'symbol',
    INT = 'int',
    TIMESTAMP = 'timestamp',
    LONG = 'long',
    DECIMAL128 = 'decimal',
    MIN_KEY = 'minKey',
    MAX_KEY = 'maxKey'
}

export const UserCollection = 'users';
export const UserTokenCollection = 'userTokens';

export const collections = [UserCollection, UserTokenCollection];

export const UserCollectionValidationTitle = 'User collection validation object';
export const UserTokenValidationTitle = 'User Token collection validation object';
