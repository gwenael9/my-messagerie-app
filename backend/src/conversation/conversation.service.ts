import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      relations: { users: true },
    });
  }

  async create(users: User[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.create({
      users: users,
    });
    return await this.conversationRepository.save(conversation);
  }

  async findById(id: number): Promise<Conversation> {
    const conversation = this.conversationRepository.findOne({
      where: { id },
      relations: ['users', 'messages', 'messages.sender', 'messages.recipient'],
      select: {
        users: { id: true, name: true },
        messages: {
          id: true,
          content: true,
          timestamp: true,
          isRead: true,
          sender: { id: true, name: true },
          recipient: { id: true, name: true },
        },
      },
    });

    if (!conversation) {
      throw new UnauthorizedException('Conversation introuvable.');
    }
    return conversation;
  }

  /**
   * Cette fonction sert seulement pour sendMessage dans message.service
   * On vérifie si une conversation existe pour ne pas dupliquer plusieurs conversation entre user
   */
  async findByUsers(users: User[]): Promise<Conversation> {
    const userIds = users.map((user) => user.id);
    const allConversations = await this.findAll();

    return allConversations.find((conversation) =>
      userIds.every((userId) =>
        conversation.users.some((user) => user.id === userId),
      ),
    );
  }
}
