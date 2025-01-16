import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { IsConversationParticipantGuard } from './guards/conversation.guard';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':id')
  @UseGuards(IsConversationParticipantGuard)
  async getOneConversation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Conversation> {
    return await this.conversationService.findById(id);
  }
}
