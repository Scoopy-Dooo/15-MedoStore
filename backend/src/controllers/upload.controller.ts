import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { AppError } from '../middlewares/errorHandler.js';

export class UploadController {
  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError('Image file is required', 400);
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      if (!cloudName || !apiKey || !apiSecret) {
        throw new AppError('Image storage is not configured on the server', 503);
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });

      const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'medostore', resource_type: 'image' },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Cloudinary returned no upload result'));
            }
          }
        );
        stream.end(file.buffer);
      });

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          size: uploaded.bytes
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
