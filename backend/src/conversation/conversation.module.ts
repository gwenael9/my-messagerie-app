import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConversationService } from './conversation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), JwtModule],
  controllers: [],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
