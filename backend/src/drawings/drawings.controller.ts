import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MAX_UPLOAD_BYTES } from '../config';
import { DrawingsService } from './drawings.service';

@Controller('drawings')
export class DrawingsController {
  constructor(private readonly drawings: DrawingsService) {}

  /** Público: cualquiera puede ver la galería. */
  @Get()
  list() {
    return this.drawings.list();
  }

  /** Privado: subir un dibujo. */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: (_request, file, callback) =>
        callback(null, /^image\//.test(file.mimetype)),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return this.drawings.create(title, description, file);
  }

  /** Privado: borrar un dibujo. */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.drawings.remove(id);
  }
}
