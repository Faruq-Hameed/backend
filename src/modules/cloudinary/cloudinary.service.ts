import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const timestamp = Date.now();

      // Extract name and extension
      const originalName = file.originalname;
      const ext = originalName.split('.').pop(); // e.g., "pdf"
      const baseName = originalName
        .replace(/\.[^/.]+$/, '')
        .replace(/\s+/g, '_'); // remove ext and spaces

      const fullFileName = `${baseName}_${timestamp}.${ext}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          //all these are optional
          resource_type: 'raw', // ✅ required for non-images
          use_filename: true, // ✅ preserve original filename
          unique_filename: false, // ✅ don't auto-generate name
          folder: 'assignments', // optional: group uploads
          public_id: fullFileName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
