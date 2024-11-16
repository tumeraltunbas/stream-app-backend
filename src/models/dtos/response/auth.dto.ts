import { BaseResDto } from '.';

export interface CreateUserResDto extends BaseResDto {
    accessToken?: string;
    refreshToken?: string;
}

export interface LoginResDto extends BaseResDto {
    accessToken?: string;
    refreshToken?: string;
}
