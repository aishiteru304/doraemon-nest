import { Controller, Get } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSession } from './user-session.entity';

@Controller('user-sessions')
export class UserSessionsController {
    constructor(private readonly userSessionsService: UserSessionsService) { }

    @Get()
    async findAll(): Promise<UserSession[]> {
        return this.userSessionsService.findAll();
    }

}
