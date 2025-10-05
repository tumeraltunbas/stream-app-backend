import { IsOptional, IsString } from 'class-validator';

export class UpdateChannelReqDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    biography: string;
}
