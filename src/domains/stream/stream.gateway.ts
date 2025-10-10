import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '../../infrastructure/logger/logger.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class StreamGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly logger: Logger) {}

    @WebSocketServer()
    server: Server;

    afterInit(): void {
        this.logger.log('Stream Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`A client with id ${client.id} connected`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client with id ${client.id} disconnected`);
    }
}
