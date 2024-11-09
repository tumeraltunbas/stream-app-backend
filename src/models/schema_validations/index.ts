import { UserTokenCollectionValidationObj } from './user-token.validation';
import { UserCollectionValidationObj } from './user.validation';

const schemaValidations = [
   UserCollectionValidationObj,
   UserTokenCollectionValidationObj
];

export default schemaValidations;
