import { join } from 'path';

/** Carpeta donde se guardan las imágenes subidas. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');

/** Carpeta donde se guarda el índice de dibujos (drawings.json). */
export const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'data');

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
