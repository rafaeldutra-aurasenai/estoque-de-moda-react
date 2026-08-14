import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const AQUI = path.dirname(fileURLToPath(import.meta.url));

// server/uploads — as imagens ficam no disco; no MySQL guardamos so o nome
export const PASTA_UPLOADS = path.resolve(AQUI, '..', '..', 'uploads');

fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PASTA_UPLOADS),
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `usuario-${req.params.id}-${Date.now()}${extensao}`);
  },
});

export const uploadFoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      return cb(new Error('Formato invalido. Envie JPG, PNG, WEBP ou GIF.'));
    }
    cb(null, true);
  },
});
