import { IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../../constants/regex';

export class RegisterReqDto {
    @IsString()
    email: string;

    @IsString()
    username: string;

    @IsString()
    @Matches(PASSWORD_REGEX)
    password: string;
}

export class LoginReqDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}
