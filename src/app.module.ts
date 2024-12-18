import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserSession } from './user-sessions/user-session.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthorsModule } from './authors/authors.module';
import { PublishersModule } from './publishers/publishers.module';
import { CategoriesModule } from './categories/categories.module';
import { Author } from './authors/author.entity';
import { Category } from './categories/category.entity';
import { Publisher } from './publishers/publisher.entity';
import { BooksModule } from './books/books.module';
import { Book } from './books/book.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { OrderDetail } from './order-detail/order-detail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, UserSession, Author, Category, Publisher, Book, Order, OrderDetail],
      synchronize: true,
    }),

    UsersModule,
    AuthorsModule,
    PublishersModule,
    CategoriesModule,
    BooksModule,
    CloudinaryModule,
    OrderDetailModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
