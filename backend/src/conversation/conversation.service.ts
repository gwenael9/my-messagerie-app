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
    return user.conversations;
  }

  // créer une conversation
  async create(users: User[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.create({
      users: users,
    });
    return await this.conversationRepository.save(conversation);
    // ne pas renvoyer les conversations des users (a voir dans la reponse de la requete : http://localhost:4000/conversations/user/2)
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
    // Trier les messages du plus récent au moins récent
    (await conversation).messages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
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

  /**
   * Vérifier qu'une conversion existe entre deux users
   * Si non, on l'a créé et renvoie cette conversation
   */
  async findOneConversationOfUsers(
    userId: number,
    otherUserId: number,
  ): Promise<Conversation> {
    const user = await this.userService.findById(userId);
    const otherUser = await this.userService.findById(otherUserId);

    if (userId === otherUserId) {
      throw new UnauthorizedException(
        'Impossible de créer une conversation pour vous même.',
      );
    }

    if (!user || !otherUser) {
      throw new UnauthorizedException(
        "Vous ou l'autre utilisateur est introuvable",
      );
    }

    // on vérifie si une conversation existe
    const conversationAlreadyExist = await this.findByUsers([user, otherUser]);

    // si oui, on renvoie l'ID de cette conversation
    if (conversationAlreadyExist) {
      return conversationAlreadyExist;
    }

    // si non, on créé une nouvelle conversation puis renvoie l'ID de cette dernière
    const newConversation = await this.create([user, otherUser]);
    return newConversation;
  }

  async seenAllMessageOfConversation(
    conversationId: number,
    userId: number,
  ): Promise<Conversation> {
    const conversation = await this.findById(conversationId);

    // vérifier si la conversation nous appartient bien
    if (!conversation.users.some((user) => user.id === userId)) {
      throw new UnauthorizedException(
        'Cette conversation ne vous appartient pas.',
      );
    }

    // on met tout les messages qu'on a reçu sur vue
    // conversation.messages.forEach((message) => {
    //   if (message.sender.id !== userId) {
    //     message.isRead = true;
    //   }
    // });

    await this.conversationRepository
      .createQueryBuilder()
      .update('message')
      .set({ isRead: true })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('recipientId = :userId', { userId })
      .execute();

    return conversation;
  }

  // recuperer le dernier message envoyé par l'autre user et le nombre de message non lu
  async getConversationSummary(userId: number): Promise<
    {
      id: number;
      lastMessage: { content: string; timestamp: Date };
      unreadCount: number;
    }[]
  > {
    const conversations = await this.findAllForUser(userId);

    const summary = conversations
      .map((conversation) => {
        // Trier les messages par timestamp décroissant pour obtenir le dernier message
        const sortedMessages = [...conversation.messages].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        const lastMessage = sortedMessages[0]
          ? {
              content: sortedMessages[0].content,
              timestamp: sortedMessages[0].timestamp,
              senderId: sortedMessages[0].sender.id,
            }
          : null;

        // Compter les messages envoyés par d'autres utilisateurs que `userId`
        const unreadCount = conversation.messages.filter(
          (message) => message.sender.id !== userId && !message.isRead,
        ).length;

        return {
          id: conversation.id,
          lastMessage,
          unreadCount,
        };
      })
      .filter((conversation) => conversation.lastMessage !== null);

    return summary;
  }
}
