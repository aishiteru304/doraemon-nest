import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsController } from './user-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './user-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession])
  ],
  providers: [UserSessionsService],
  controllers: [UserSessionsController]
})
export class UserSessionsModule { }
