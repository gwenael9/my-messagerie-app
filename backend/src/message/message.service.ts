import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async sendMessage(
    content: string,
    senderId: number,
    recipientId: number,
  ): Promise<Message> {
    if (!content) {
      throw new NotFoundException('Veuillez renseigner un message.');
    }

    // on vérifie que l'on envoie pas un message à nous même
    if (senderId === recipientId) {
      throw new NotFoundException(
        'Impossible de vous envoyer un message à vous même !',
      );
    }

    const sender = await this.userService.findById(senderId);
    const recipient = await this.userService.findById(recipientId);

    if (!sender || !recipient) {
      throw new NotFoundException('Expéditeur ou destinataire introuvable.');
    }

    let conversation: Conversation;

    // on vérifie qu'une conversation existe déjà entre les deux users
    conversation = await this.conversationService.findByUsers([
      sender,
      recipient,
    ]);

    // s'il n'y a pas de discussion, on l'a crée
    if (!conversation) {
      conversation = await this.conversationService.create([sender, recipient]);
    }

    // on crée le message
    const message = this.messageRepository.create({
      content,
      sender,
      recipient,
      conversation,
    });
    message.timestamp = new Date();

    await this.messageRepository.save(message);
    return await this.messageRepository.findOne({
      where: { id: message.id },
      relations: ['sender'],
    });
  }

  // récupérer le nombre de message non lus pour une personne
  async getAllNbOfMessageNotRead(userId: number): Promise<number> {
    return await this.messageRepository.count({
      where: {
        recipient: { id: userId },
        isRead: false,
      },
    });
  }
}
