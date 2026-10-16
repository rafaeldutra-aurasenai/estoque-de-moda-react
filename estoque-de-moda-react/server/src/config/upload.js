
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PASTA_UPLOADS = path.resolve(__dirname, "../../uploads");

fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, PASTA_UPLOADS);
  },

  filename: (_req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    const nome = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;

    callback(null, nome);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Envie somente arquivos de imagem."));
    }

    callback(null, true);
  },
});

export default upload;

