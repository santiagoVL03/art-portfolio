import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { DATA_DIR, UPLOAD_DIR } from '../config';

interface Drawing {
  id: string;
  title: string;
  description: string;
  filename: string;
  createdAt: string;
}

export interface PublicDrawing extends Omit<Drawing, 'filename'> {
  url: string;
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

@Injectable()
export class DrawingsService {
  private readonly dataFile = join(DATA_DIR, 'drawings.json');

  async list(): Promise<PublicDrawing[]> {
    const drawings = await this.readAll();
    return drawings
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((drawing) => this.toPublic(drawing));
  }

  async create(
    title: string,
    description: string,
    file?: Express.Multer.File,
  ): Promise<PublicDrawing> {
    if (!file) {
      throw new BadRequestException('Adjuntá una imagen en el campo "image".');
    }

    const cleanTitle = (title ?? '').trim();
    if (!cleanTitle) {
      throw new BadRequestException('El título es obligatorio.');
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}${EXTENSIONS[file.mimetype] ?? '.img'}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);

    const drawing: Drawing = {
      id: randomUUID(),
      title: cleanTitle.slice(0, 120),
      description: (description ?? '').trim().slice(0, 500),
      filename,
      createdAt: new Date().toISOString(),
    };

    const drawings = await this.readAll();
    drawings.push(drawing);
    await this.writeAll(drawings);

    return this.toPublic(drawing);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const drawings = await this.readAll();
    const index = drawings.findIndex((drawing) => drawing.id === id);

    if (index === -1) {
      throw new NotFoundException('Dibujo no encontrado.');
    }

    const [removed] = drawings.splice(index, 1);
    await this.writeAll(drawings);
    await unlink(join(UPLOAD_DIR, removed.filename)).catch(() => undefined);

    return { ok: true };
  }

  private toPublic(drawing: Drawing): PublicDrawing {
    return {
      id: drawing.id,
      title: drawing.title,
      description: drawing.description,
      createdAt: drawing.createdAt,
      url: `/uploads/${drawing.filename}`,
    };
  }

  private async readAll(): Promise<Drawing[]> {
    try {
      const raw = await readFile(this.dataFile, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async writeAll(drawings: Drawing[]): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(this.dataFile, JSON.stringify(drawings, null, 2), 'utf8');
  }
}
