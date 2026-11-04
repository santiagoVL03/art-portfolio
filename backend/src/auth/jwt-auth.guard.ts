import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = (request.headers.authorization ?? '').split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token de sesión.');
    }

    try {
      const payload = await this.jwt.verifyAsync(token);
      (request as Request & { user?: unknown }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }
  }
}
