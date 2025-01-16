import { Injectable } from '@nestjs/common';
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

  async create(users: User[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.create({
      users: users,
    });
    return await this.conversationRepository.save(conversation);
  }

  async findById(id: number): Promise<Conversation> {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async findByUser(users: User[]): Promise<Conversation> {
    return this.conversationRepository.findOne({
      where: { users: users },
      relations: ['users'],
    });
  }
}
