import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLE, User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    // hacher le mot de passe
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    // rôle de l'user
    user.role = await this.defineRole(user.email);

    return this.userRepository.save(user);
  }

  private async defineRole(email: string): Promise<ROLE> {
    const emails = process.env.ADMIN_EMAILS;

    // séparer la chaîne en un tableau d'emails
    const adminEmails = emails.split(',').map((e) => e.trim());
    return adminEmails.includes(email) ? 'ADMIN' : 'USER';
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['conversations', 'conversations.messages', 'friends'],
    });
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findById(userId);
    const friend = await this.findById(friendId);

    if (!user || !friend) {
      throw new Error('User ou Ami introuvable.');
    }

    // Vérifier s'ils ne sont pas déjà amis
    await this.verifyIsAlreadyFriend(user, friend);

    friend.friends.push(user);
    await this.userRepository.save(friend);

    user.friends.push(friend);
    await this.userRepository.save(user);

    return this.findById(userId);
  }

  async saveFriends(user: User, friend: User): Promise<void> {
    friend.friends.push(user);
    await this.userRepository.save(friend);

    user.friends.push(friend);
    await this.userRepository.save(user);
  }

  async removeFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findById(userId);
    const friend = await this.findById(friendId);

    if (!user || !friend) {
      throw new Error('User ou Ami introuvable.');
    }

    user.friends = user.friends.filter((friend) => friend.id !== friendId);
    return await this.userRepository.save(user);
  }

  async getMyFriends(userId: number): Promise<User[]> {
    const user = await this.findById(userId);
    return user.friends;
  }

  async verifyIsAlreadyFriend(user: User, friend: User): Promise<void> {
    const alreadyFriends = user.friends.some((f) => f.id === friend.id);
    if (alreadyFriends) {
      throw new UnauthorizedException('Vous êtes déjà amis.');
    }
  }
}
