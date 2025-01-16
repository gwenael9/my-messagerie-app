import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Payload } from 'src/types/payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['token'];

    if (!token) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé.");
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decoded as Payload;
      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException("Vous n'êtes pas autorisé.");
    }
  }
}
