import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { JwtAuthMiddleware } from 'src/middlewares/jwt';
import { Category } from './category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, UserSession]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'categories', method: RequestMethod.POST },
        { path: 'categories/:id', method: RequestMethod.DELETE },
      );
  }
}
