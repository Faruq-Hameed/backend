import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/guards/public.guard';

@Controller('images')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    // This prevents users from uploading anything else (like images or ZIPs).
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only PDF and DOCX files are allowed'), false);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('file to upload is : ', { file });
    const uploadResponse = await this.cloudinaryService.uploadFile(file);
    console.log({ uploadResponse });
    return {
      message: uploadResponse.message,
      data: uploadResponse.metadata,
      url: uploadResponse.url,
    };
  }
}
