import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/types/payload';
import { Message } from './message.entity';
import { MessageGateway } from './message.gateway';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Post('send/:recipientId')
  @HttpCode(200)
  async sendMessage(
    @Body()
    body: {
      content: string;
    },
    @Req() request: Request,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ): Promise<Message> {
    const { content } = body;

    // on récupère l'user connecté
    const user = request.user as Payload;

    // on envoie le message
    const message = await this.messageService.sendMessage(
      content,
      user.sub,
      recipientId,
    );

    console.log(
      'Appel WebSocket depuis controller :',
      user.sub,
      recipientId,
      message,
    );

    this.messageGateway.sendMessageToUsers(user.sub, recipientId, message);

    return message;
  }

  @Get('number/noread')
  @UseGuards(AuthGuard)
  async getNbMessagesNotRead(
    @Req() request: Request,
  ): Promise<{ message: string; number: number }> {
    const user = request.user as Payload;
    const number = await this.messageService.getAllNbOfMessageNotRead(user.sub);
    return { message: `Vous avez ${number} messages non lus.`, number: number };
  }
}
