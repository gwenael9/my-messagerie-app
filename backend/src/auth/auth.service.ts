import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const messageError = 'Invalid credentials';

    // on vérifie que l'user existe
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(messageError);
    }

    // on vérifie que le mot de passe est le bon
    const samePassword = await bcrypt.compare(password, user.password);

    if (!samePassword) {
      throw new UnauthorizedException(messageError);
    }
    return user;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  // vérifie si le token est présent dans les cookies
  async isConnected(req: Request): Promise<string> {
    return req.cookies['token'];
  }

  async getUserFromToken(request: Request): Promise<User> {
    const jwtCookie = await this.isConnected(request);
    if (!jwtCookie) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const decoded = this.jwtService.verify(jwtCookie);
      return await this.userService.findById(decoded.sub);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
