export const ERROR_CODES = {
    processFailureError: 'process_failure_error',
    userAlreadyExists: 'user_already_exists',
    validationError: 'validation_error',
    invalidCredentials: 'invalid_credentials',
    inactiveUser: 'inactive_user',
    authorizationError: 'authorization_error',
    notFound: 'not_found',
    channelNotFound: 'channel_not_found',
    cannotFollowOwnChannel: 'cannot_follow_own_channel',
    streamNotFound: 'stream_not_found',
    unauthorizedAction: 'unauthorized_action',
    tokenPayloadNotRetrieved: 'token_payload_not_retrieved',
    googleSignInNotAllowed: 'google_sign_in_not_allowed',
};

export const ERROR_MESSAGES = {
    process_failure_error: 'Process failure error.',
    user_already_exists: 'User already exists.',
    validation_error: 'Validation error.',
    invalid_credentials: 'Invalid credentials.',
    inactive_user: 'Inactive user.',
    authorization_error: 'Authorization error.',
    not_found: 'Not found.',
    channel_not_found: 'Channel not found.',
    cannot_follow_own_channel: 'User cannot follow his/her own channel.',
    stream_not_found: 'Stream not found.',
    unauthorized_action: 'Unauthorized action.',
    token_payload_not_retrieved: 'Token payload not retrieved.',
    google_sign_in_not_allowed:
        'This email is already registered with a password. Please sign in using your password instead.',
};
