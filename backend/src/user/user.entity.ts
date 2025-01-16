import { Conversation } from 'src/conversation/conversation.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';

export type ROLE = 'ADMIN' | 'USER';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @OneToMany(() => Message, (message) => message.sender)
  messageSend: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  messageReceived: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];
}
