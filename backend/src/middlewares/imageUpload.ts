import multer from 'multer';
import type { RequestHandler } from 'express';
import { AppError } from './errorHandler.js';

const maxFileSize = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);
const acceptedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number.isFinite(maxFileSize) && maxFileSize > 0 ? maxFileSize : 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!acceptedImageTypes.has(file.mimetype)) {
      callback(new AppError('Only JPEG, PNG, WebP, and GIF images are allowed', 400));
      return;
    }
    callback(null, true);
  }
});

export const uploadSingleImage: RequestHandler = (req, res, next) => {
  upload.single('image')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      next(new AppError(
        error.code === 'LIMIT_FILE_SIZE' ? 'Image exceeds the upload size limit' : error.message,
        statusCode
      ));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    if (!req.file) {
      next(new AppError('Image file is required', 400));
      return;
    }
    next();
  });
};
