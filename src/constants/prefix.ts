export enum AUTH_PREFIXES {
    BASE = 'auth',
    REGISTER = 'register',
    LOGIN = 'login',
}

export enum CHANNEL_PREFIXES {
    BASE = 'channels',
    UPDATE = ':channelId',
    FOLLOW = ':channelId/follow',
    UNFOLLOW = ':channelId/unfollow',
}

export enum ROOM_PREFIXES {
    BASE = 'rooms',
}

export enum GOOGLE_AUTH_PREFIXES {
    BASE = 'google-auth',
    CALLBACK = 'callback',
}
