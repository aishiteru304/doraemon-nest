import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Author } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ACCOUNT_ROLE } from 'src/constant/user.constant';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,
    ) { }

    getAllAuthors(): Promise<Author[]> {
        try {
            return this.authorsRepository.find();
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    async createAuthor(req: Request, createAuthorDto: CreateAuthorDto): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }

            const { name } = createAuthorDto

            // Kiểm tra tác giả đã tồn tại chưa
            const existingAuthor = await this.authorsRepository.findOne({ where: { name } });
            if (existingAuthor) {
                throw new HttpException('Author already exists', HttpStatus.BAD_REQUEST);
            }

            const newAuthor = this.authorsRepository.create({
                name
            })
            await this.authorsRepository.save(newAuthor)

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Created author successfully.',
            };
        }
        catch (error) {
            // Kiểm tra nếu lỗi là một HttpException
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async deleteAuthor(req: Request, id: number): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }
            await this.authorsRepository.delete({ id });

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.OK,
                message: 'Author deleted successfully.',
            };
        }
        catch (error) {
            // Kiểm tra nếu lỗi là một HttpException
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
