import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  messageError = "Vous n'êtes pas autorisé.";

  use(req: Request, res: Response, next: NextFunction) {
    this.verifyToken(req);
    next();
  }

  protected verifyToken(req: Request): void {
    const token = req.cookies['token'];

    if (!token) {
      throw new UnauthorizedException(this.messageError);
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = decoded;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(this.messageError);
    }
  }
}

@Injectable()
export class AdminMiddleware extends AuthMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    super.verifyToken(req);

    const { role } = req.user as User;
    if (role !== 'ADMIN') {
      throw new UnauthorizedException(this.messageError);
    }

    next();
  }
}
