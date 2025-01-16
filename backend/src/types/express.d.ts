import { Payload } from './payload';

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
    }
  }
}
