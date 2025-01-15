import { Injectable } from '@nestjs/common';
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

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
