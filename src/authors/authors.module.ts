import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author } from './author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthMiddleware } from 'src/middlewares/jwt';
import { UserSession } from 'src/user-sessions/user-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author, UserSession]),
  ],
  providers: [AuthorsService],
  controllers: [AuthorsController]
})
export class AuthorsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'authors', method: RequestMethod.POST },
        { path: 'authors/:id', method: RequestMethod.DELETE },
      );
  }
}
