import { Conversation } from 'src/conversation/conversation.entity';
import { FriendRequest } from 'src/friendRequest/friendRequest.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export type ROLE = 'ADMIN' | 'USER';
export type GENDER = 'HOMME' | 'FEMME';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  })
  role: ROLE;

  @Column({
    type: 'text',
    enum: ['HOMME', 'FEMME'],
    nullable: true,
  })
  gender: GENDER;

  /**
   * true = public
   */
  @Column({
    default: true,
  })
  profilVisibility: boolean;

  @OneToMany(() => Message, (message) => message.sender)
  messageSend: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  messageReceived: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'user_friends',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];
}
