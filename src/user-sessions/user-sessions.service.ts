import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSession } from './user-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSessionsService {
    constructor(
        @InjectRepository(UserSession)
        private usersRepository: Repository<UserSession>,
    ) { }

    findAll(): Promise<UserSession[]> {

        try {
            return this.usersRepository.find();
        }
        catch (error) {
            throw new HttpException("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
