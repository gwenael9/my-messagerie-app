import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];
    if (token) {
      try {
        req.user = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (err) {
        console.warn('Invalid token:', err.message);
      }
    }
    next();
  }
}
