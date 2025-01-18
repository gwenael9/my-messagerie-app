import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UserService,
  ) {}

  // récupérer toutes les conversations
  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      relations: { users: true },
    });
  }

  /**
   *
   * @param userId L'ID de l'utilisateur
   * @returns Toutes les conversations de l'utilisateur connecté
   */
  async findAllForUser(userId: number): Promise<Conversation[]> {
    const user = await this.userService.findById(userId);
    return await this.conversationRepository.find({
      where: { users: user },
      relations: { messages: true },
    });
  }

  // créer une conversation
  async create(users: User[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.create({
      users: users,
    });
    return await this.conversationRepository.save(conversation);
  }

  // récupérer une conversation avec son ID
  async findById(id: number): Promise<Conversation> {
    const conversation = this.conversationRepository.findOne({
      where: { id },
      relations: ['users', 'messages', 'messages.sender', 'messages.recipient'],
      select: {
        users: { id: true, firstname: true, lastname: true },
        messages: {
          id: true,
          content: true,
          timestamp: true,
          isRead: true,
          sender: { id: true, firstname: true, lastname: true },
          recipient: { id: true, firstname: true, lastname: true },
        },
      },
    });

    if (!conversation) {
      throw new UnauthorizedException('Conversation introuvable.');
    }
    return conversation;
  }

  /**
   *
   * @param users Tout les participants
   * @returns La conversation de N utilisateurs
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
