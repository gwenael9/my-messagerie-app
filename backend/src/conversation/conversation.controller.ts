import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { IsConversationParticipantGuard } from './guards/conversation.guard';
import { Request } from 'express';
import { Payload } from 'src/types/payload';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard, AuthGuard)
  async getAllConversations(): Promise<Conversation[]> {
    return await this.conversationService.findAll();
  }

  @Get(':id')
  @UseGuards(IsConversationParticipantGuard, AuthGuard)
  async getOneConversation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Conversation> {
    return await this.conversationService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllConversationsForUser(
    @Req() request: Request,
  ): Promise<Conversation[]> {
    const user = request.user as Payload;
    return await this.conversationService.findAllForUser(user.sub);
  }
}
