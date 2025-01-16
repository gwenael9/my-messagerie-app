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
    conversationId?: number,
  ): Promise<Message> {
    const sender = await this.userService.findById(senderId);
    const recipient = await this.userService.findById(recipientId);

    if (!sender || !recipient) {
      throw new NotFoundException('Expéditeur ou destinataire introuvable.');
    }

    let conversation: Conversation;

    if (conversationId) {
      conversation = await this.conversationService.findById(conversationId);

      if (!conversation) {
        throw new NotFoundException('Conversation introuvable.');
      }
    } else {
      conversation = await this.conversationService.findByUser([
        sender,
        recipient,
      ]);

      if (!conversation) {
        conversation = await this.conversationService.create([
          sender,
          recipient,
        ]);
      }
    }

    const message = this.messageRepository.create({
      content,
      sender,
      recipient,
      conversation,
    });

    return this.create(message);
  }

  async create(message: Message): Promise<Message> {
    message.timestamp = new Date();
    return await this.messageRepository.save(message);
  }
}
