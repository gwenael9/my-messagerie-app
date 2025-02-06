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
      console.log(`User ${userId} connecté avec socket ${socket.id}`);
    } else {
      console.log("Connexion d'un utilisateur sans ID");
    }
    console.log('Utilisateurs connectés :', this.users);
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.users.entries()].find(
      ([, id]) => id === socket.id,
    )?.[0];
    if (userId) {
      this.users.delete(userId);
      console.log(`User ${userId} déconnecté`);
    } else {
      console.log(`Déconnexion d'un socket inconnu : ${socket.id}`);
    }
    console.log('Utilisateurs restants :', this.users);
  }

  sendMessageToUsers(senderId: number, recipientId: number, data: Message) {
    console.log('Envoi du message à', senderId, recipientId);

    const recipientSocket = this.users.get(recipientId);

    if (recipientSocket) {
      console.log('envoie du message au destinataire', data);
      this.server.to(recipientSocket).emit('receiveMessage', {
        data,
      });
    }
  }
}
