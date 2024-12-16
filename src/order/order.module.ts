import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { JwtAuthMiddleware } from 'src/middlewares/jwt';
import { OrderDetail } from 'src/order-detail/order-detail.entity';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { User } from 'src/users/user.entity';
import { Book } from 'src/books/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, OrderDetail, UserSession, Book]),
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'order', method: RequestMethod.POST },
        { path: 'order', method: RequestMethod.GET },
      );
  }
}
