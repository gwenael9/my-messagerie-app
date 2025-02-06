import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { JwtModule } from '@nestjs/jwt';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { AuthModule } from 'src/auth/auth.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule,
    UserModule,
    ConversationModule,
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
