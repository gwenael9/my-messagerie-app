import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLE, User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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

  async findAllPublicAccount(userId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { profilVisibility: true, id: Not(userId) },
      relations: ['friends'],
    });
  }

  async findByEmail(email: string): Promise<User> {
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

  /**
   * Supprimer un ami
   * @param userId L'ID de l'user connecté
   * @param friendId L'ID de l'user à supprimer
   * @returns On renvoie l'user supprimé
   */
  async removeFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findById(userId);
    const friend = await this.findById(friendId);

    if (!user || !friend) {
      throw new Error('User ou Ami introuvable.');
    }

    // on vérifie que l'user a supprimé fais partie des amis de l'user connecté
    if (!user.friends.some((f) => f.id === friendId)) {
      throw new UnauthorizedException(
        `${friend.firstname} ne fais pas partie de vos amis.`,
      );
    }

    // on supprime l'user des amis de l'user n°1
    user.friends = user.friends.filter((friend) => friend.id !== friendId);
    await this.userRepository.save(user);

    // on supprime l'user des amis de l'user n°2
    friend.friends = friend.friends.filter((u) => u.id !== userId);
    await this.userRepository.save(friend);

    // on renvoie l'user supprimé du point de vue de l'user connecté
    return friend;
  }

  // renvoie tout les amis d'un user selon son ID
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

  async modifyProfileVisibility(userId: number): Promise<string> {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('User introuvable');
    }

    // inversion de la visibilité
    user.profilVisibility = !user.profilVisibility;
    await this.userRepository.save(user);

    // renvoie un message de confirmation
    return `La visibilité du profil a été mise à jour : ${
      user.profilVisibility ? 'publique' : 'privée'
    }.`;
  }
}
