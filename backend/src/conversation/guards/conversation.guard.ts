import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Payload } from 'src/types/payload';
import { ConversationService } from '../conversation.service';

@Injectable()
export class IsConversationParticipantGuard implements CanActivate {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // récupérer la requête
    const request = context.switchToHttp().getRequest();

    // récupérer l'user connecté
    const user: Payload = request.user;

    // récupérer l'ID de la conversation depuis les paramètres
    const conversationId = parseInt(request.params.id, 10);
    if (isNaN(conversationId)) {
      throw new UnauthorizedException('Conversation ID invalide.');
    }

    // récupérer la conversation
    const conversation =
      await this.conversationService.findById(conversationId);

    // Vérifier si l'user connecté est un participant de la conversation
    const isParticipant = conversation.users.some(
      (participant) => participant.id === user.sub,
    );

    if (!isParticipant) {
      throw new UnauthorizedException(
        'Vous ne faites pas partie des participants de cette conversation.',
      );
    }

    return true;
  }
}
