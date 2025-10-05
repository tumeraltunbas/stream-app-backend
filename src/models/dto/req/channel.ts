import { IsOptional, IsString } from 'class-validator';
import { User } from '../../entities/user';
import { Channel } from '../../entities/channel';

export class UpdateChannelReqDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    biography: string;

    channel: Channel;
}

export class FollowChannelReqDto {
    user: User;
    channel: Channel;
}

export class UnfollowChannelReqDto {
    user: User;
    channel: Channel;
}
