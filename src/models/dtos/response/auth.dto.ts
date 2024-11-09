import { BaseResDto } from '.';

export interface CreateUserResDto extends BaseResDto {
   accessToken?: string;
   refreshToken?: string;
}
