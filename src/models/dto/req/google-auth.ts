import { IsString } from 'class-validator';

export class GoogleOAuthReqDto {
    @IsString()
    credential: string;
}
