import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
