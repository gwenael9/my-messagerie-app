import { ROLE } from 'src/user/user.entity';

export type Payload = {
  email: string;
  sub: number;
  role: ROLE;
  iat?: number;
  exp?: number;
};
