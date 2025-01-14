import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken } = await this.authService.login(user);

    // Définir le cookie avec le JWT
    response.cookie('auth-cookie', accessToken, {
      httpOnly: true, // Sécurise le cookie
      secure: process.env.NODE_ENV === 'production', // Utilise HTTPS en production
      maxAge: 3600000, // 1 heure
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    response.clearCookie('auth-cookie');
    return { message: 'Logout successful' };
  }
}
