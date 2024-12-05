import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController]
})
export class CloudinaryModule { }
