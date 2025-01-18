import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';
import { Payload } from 'src/types/payload';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  /**
   * Ajouter une route permettant de voir tout les users public
   */
  @Get('public')
  // @UseGuards(AuthGuard)
  async findAllPublicUsers(@Req() request: Request): Promise<User[]> {
    const user = request.user as Payload; // Extraire l'utilisateur connecté depuis le token
    const userId = user ? user.sub : undefined; // Utiliser l'ID de l'utilisateur connecté, ou `undefined` si non connecté
    return await this.userService.findAllPublicAccount(userId);
  }

  // inutile
  @Get('friends')
  @UseGuards(AuthGuard)
  async findFriends(@Req() request: Request): Promise<User[]> {
    const user = request.user as Payload;
    return await this.userService.getMyFriends(user.sub);
  }

  /**
   * Supprime un ami de la liste de l'utilsateur connecté
   * @param friendId L'ID de l'utilisateur à supprimer
   * @returns Un message de confirmation
   */
  @Delete('/friends/remove/:friendId')
  @UseGuards(AuthGuard)
  async removeFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as Payload;
    const friendToDelete = await this.userService.removeFriend(
      user.sub,
      friendId,
    );
    return {
      message: `${friendToDelete.firstname} a été supprimé de vos amis.`,
    };
  }

  /**
   * Modifie la visibilité du profil de l'utilisateur connecté
   */
  @Patch('visibility')
  @UseGuards(AuthGuard)
  async modifyProfileVisibility(
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as Payload;
    const result = await this.userService.modifyProfileVisibility(user.sub);
    return { message: result };
  }
}
