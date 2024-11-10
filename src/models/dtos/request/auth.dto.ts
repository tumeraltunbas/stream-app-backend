import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../contants/regex';
import { BaseReqDto } from '.';
import { PasswordRegexError } from '../../../contants/error';

export class RegisterReqDto implements BaseReqDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Matches(passwordRegex, {
        message: PasswordRegexError
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
