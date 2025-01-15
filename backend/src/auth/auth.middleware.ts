import {
  ForbiddenException,
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

  use(req: Request, res: Response, next: NextFunction) {
    this.verifyToken(req);
    next();
  }

  protected verifyToken(req: Request): void {
    const token = req.cookies['token'];

    if (!token) {
      throw new UnauthorizedException("Vous n'êtes pas connecté.");
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = decoded;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Le token est invalide ou expiré.');
    }
  }
}

@Injectable()
export class AdminMiddleware extends AuthMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    super.verifyToken(req);

    const { role } = req.user as User;
    if (role !== 'ADMIN') {
      throw new ForbiddenException("Vous n'avez pas les droits nécessaires.");
    }

    next();
  }
}
