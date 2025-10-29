import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '../../infrastructure/logger/logger.service';
import { Server, Socket } from 'socket.io';
import { JoinStreamReqDto } from '../../models/dto/req/stream';
import { StreamOrchestration } from './stream.orchestration';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class StreamGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly logger: Logger,
        private readonly streamOrchestration: StreamOrchestration,
    ) {}

    @WebSocketServer()
    server: Server;

    afterInit(): void {
        this.logger.log('Stream Gateway initialized');
    }

    async handleConnection(client: Socket) {
        const joinStreamReqDto: JoinStreamReqDto = {
            roomId: client.handshake.query.roomId as string,
            streamKey: client.handshake.query?.streamKey as string,
        };

        await this.streamOrchestration.joinStream(joinStreamReqDto, client);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client with id ${client.id} disconnected`);
    }
}
