import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/types/payload';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body()
    body: {
      content: string;
      recipientId: number;
      conversationId?: number;
    },
    @Req() request: Request,
  ) {
    const { content, recipientId, conversationId } = body;

    // on vérifie que le contenu et le destinataire sont présent
    if (!content || !recipientId) {
      throw new NotFoundException(
        'Le contenu et le destinataire sont requis !',
      );
    }

    // on récupère l'user connecté
    const user = request.user as Payload;

    // on vérifie que l'on envoie pas un message à nous même
    if (user.sub === recipientId) {
      throw new NotFoundException(
        'Impossible de vous envoyer un message à vous même !',
      );
    }

    // on envoie le message
    const message = await this.messageService.sendMessage(
      content,
      user.sub,
      recipientId,
      conversationId,
    );

    return {
      message: 'Message envoyé avec succès.',
      data: message,
    };
  }
}
