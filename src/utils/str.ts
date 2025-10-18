import crypto from 'crypto';
import configuration from '../config/configuration';

export function combinePath(...paths: string[]): string {
    return paths.join('/');
}

export function generateStreamKey(): string {
    const streamKeyBytes = configuration().security.streamKeyBytes;
    return crypto.randomBytes(streamKeyBytes).toString('hex');
}
