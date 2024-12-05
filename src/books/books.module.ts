import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { JwtAuthMiddleware } from 'src/middlewares/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Category } from 'src/categories/category.entity';
import { Publisher } from 'src/publishers/publisher.entity';
import { Author } from 'src/authors/author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, UserSession, Category, Publisher, Author]),
    NestjsFormDataModule
  ],
  providers: [BooksService, CloudinaryService],
  controllers: [BooksController]
})
export class BooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'books', method: RequestMethod.POST },
        { path: 'books/:id', method: RequestMethod.PATCH },
        { path: 'books/:id', method: RequestMethod.DELETE },
      );
  }
}
