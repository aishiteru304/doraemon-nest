import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { Publisher } from './publisher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { JwtAuthMiddleware } from 'src/middlewares/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publisher, UserSession]),
  ],
  providers: [PublishersService],
  controllers: [PublishersController]
})
export class PublishersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'publishers', method: RequestMethod.POST },
        { path: 'publishers/:id', method: RequestMethod.DELETE },
      );
  }
}
