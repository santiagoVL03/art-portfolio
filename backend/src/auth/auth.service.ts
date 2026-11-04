import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwt: JwtService) {
    if (!process.env.JWT_SECRET) {
      this.logger.warn('JWT_SECRET no está definido: se usa un secreto de desarrollo.');
    }
    if (!process.env.ADMIN_PASSWORD) {
      this.logger.warn('ADMIN_PASSWORD no está definido: se usa "cambia-esta-clave".');
    }
  }

  async login(username: string, password: string) {
    const expectedUser = process.env.ADMIN_USER ?? 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD ?? 'cambia-esta-clave';

    const userOk = this.safeEqual(username.trim(), expectedUser);
    const passwordOk = this.safeEqual(password, expectedPassword);

    if (!userOk || !passwordOk) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const token = await this.jwt.signAsync({ sub: expectedUser, username: expectedUser });
    return { token, username: expectedUser };
  }

  private safeEqual(input: string, expected: string): boolean {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
