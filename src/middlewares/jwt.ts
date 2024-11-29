import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

    constructor(
        @InjectRepository(UserSession)
        private userSessionsRepository: Repository<UserSession>,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const userId = decoded['id']

            // Kiểm tra user có trong user session không
            const existingUserSession = await this.userSessionsRepository.findOne({
                where: {
                    user: { id: userId }
                }
            });

            // Nếu không có thì lỗi
            if (!existingUserSession) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }

            req['user'] = decoded;
            next();
        } catch (error) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }
    }
}
