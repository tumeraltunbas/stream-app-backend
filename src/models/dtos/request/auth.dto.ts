import {
   IsEmail,
   IsNotEmpty,
   IsString,
   Matches,
} from 'class-validator';
import { passwordRegex } from '../../../contants/regex';

export class RegisterReqDto {
   @IsString()
   @IsNotEmpty()
   username: string;

   @IsString()
   @IsNotEmpty()
   @IsEmail()
   email: string;

   @IsString()
   @IsNotEmpty()
   //TODO: Move the message to the constants.
   @Matches(passwordRegex, {
      message:
         'Your password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'
   })
   password: string;
}
