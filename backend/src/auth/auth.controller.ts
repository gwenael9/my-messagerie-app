// import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response, Request } from 'express';
import { User } from '../user/user.entity';
import { Payload } from 'src/types/payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() user: User,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    // on vérifie si l'user est connecté
    const isConnected = await this.authService.isConnected(request);
    // s'il est connecté, il ne pourra pas créer de compte
    if (isConnected) {
      return { message: 'Vous êtes déjà connecté.' };
    }

    const userCreate = await this.userService.create(user);
    return {
      message: `Votre compte a bien été créé ${userCreate.firstname} !`,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    // on vérifie si l'user est déjà connecté
    const isConnected = await this.authService.isConnected(request);
    if (isConnected) {
      return { message: 'Vous êtes déjà connecté.' };
    }

    const user = await this.authService.validateUser(body.email, body.password);
    const { accessToken } = await this.authService.login(user);

    response.cookie('token', accessToken, {
      httpOnly: true,
    });

    return { message: `Bienvenue ${user.firstname} !` };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    // on vérifie si l'user est bien déconnecté avant de se déconnecter
    const isConnected = await this.authService.isConnected(request);
    if (!isConnected) {
      return { message: 'Aucun compte connecté.' };
    }

    // on supprime le cookie
    response.clearCookie('token');
    return { message: 'Déconnexion confirmée.' };
  }

  @Get('me')
  async getProfile(@Req() request: Request): Promise<User> {
    const user = request.user as Payload;
    if (!user) {
      return null;
    }
    return await this.userService.findById(user.sub);
  }
}
