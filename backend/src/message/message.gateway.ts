import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './message.entity';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private users = new Map<number, string>(); // Stocke les utilisateurs connectés { userId: socketId }

  handleConnection(socket: Socket) {
    const userId = Number(socket.handshake.query.userId); // Récupère l'userId de la requête
    if (userId) {
      this.users.set(userId, socket.id);
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.users.entries()].find(
      ([, id]) => id === socket.id,
    )?.[0];
    if (userId) {
      this.users.delete(userId);
    }
  }

  sendMessageToUsers(senderId: number, recipientId: number, data: Message) {
    const recipientSocket = this.users.get(recipientId);

    if (recipientSocket) {
      this.server.to(recipientSocket).emit('receiveMessage', {
        data,
      });
    }
  }
}
