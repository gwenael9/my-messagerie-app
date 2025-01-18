import {
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestService } from './friendRequest.service';
import { Payload } from 'src/types/payload';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  /**
   *
   * @param receiverId L'ID de l'utilisateur au quel on fais la demande
   * @returns Un message de confirmation
   */
  @Post('/:receiverId')
  @UseGuards(AuthGuard)
  async sendFriendRequest(
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as Payload;
    await this.friendRequestService.sendFriendRequest(user.sub, receiverId);
    return { message: "La demande d'ami a bien été envoyé." };
  }

  /**
   *
   * @param requestId L'ID de la demande
   * @returns Un message de confirmation
   */
  @Post('/:requestId/accept')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async acceptFriendRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as Payload;
    const newFriend = await this.friendRequestService.acceptFriendRequest(
      requestId,
      user.sub,
    );
    return {
      message: `${newFriend.firstname} a bien été ajouté à votre liste d'amis !`,
    };
  }

  /**
   *
   * @param requestId L'ID de la demande
   * @returns Un message de confirmation
   */
  @Post('/:requestId/reject')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async rejectFriendRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as Payload;
    await this.friendRequestService.rejectFriendRequest(requestId, user.sub);
    return { message: "La demande d'ami a bien été supprimée." };
  }

  /**
   * Récupérer les demandes d'amis qui m'ont été envoyées
   */
}
