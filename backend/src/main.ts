import 'dotenv/config';
import { mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UPLOAD_DIR } from './config';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '').toLowerCase();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * CORS_ORIGIN admite:
 * - sin definir o "*": cualquier origen.
 * - una lista separada por comas: "https://mi-front.onrender.com,http://localhost:5173".
 * - comodines de subdominio: "https://*.onrender.com".
 *
 * Se normalizan las barras finales y mayúsculas para evitar fallos por copiar
 * la URL tal cual desde el navegador.
 */
function corsOrigin() {
  const configured = (process.env.CORS_ORIGIN ?? '').trim();
  if (!configured || configured === '*') return true;

  const allowed = configured
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)
    .map((rule) =>
      rule.includes('*')
        ? new RegExp(
            `^${rule
              .split('*')
              .map(escapeRegExp)
              .join('.*')}$`,
          )
        : rule,
    );

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Sin cabecera Origin (curl, health checks, imágenes) no hay nada que validar.
    if (!origin) return callback(null, true);

    const requested = normalizeOrigin(origin);
    const isAllowed = allowed.some((rule) =>
      typeof rule === 'string' ? rule === requested : rule.test(requested),
    );

    if (!isAllowed) {
      console.warn(`[CORS] Origen no permitido: ${origin}`);
      console.warn('[CORS] Revisá CORS_ORIGIN en las variables de entorno de la API.');
    }

    // Al devolver false no se agregan cabeceras CORS: el navegador bloquea la
    // respuesta, pero la API no falla con un 500.
    callback(null, isAllowed);
  };
}

async function bootstrap() {
  mkdirSync(UPLOAD_DIR, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: corsOrigin(),
    methods: ['GET', 'HEAD', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  });

  // Imágenes públicas: /uploads/<archivo>
  app.useStaticAssets(UPLOAD_DIR, { prefix: '/uploads/' });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`API escuchando en http://localhost:${port}/api`);
  console.log(
    `CORS: ${process.env.CORS_ORIGIN?.trim() || '* (cualquier origen)'}`,
  );
}

void bootstrap();
