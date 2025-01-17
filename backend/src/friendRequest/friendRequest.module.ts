import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FriendRequest } from './friendRequest.entity';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestController } from './friendRequest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), JwtModule, UserModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
