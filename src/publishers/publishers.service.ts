import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './publisher.entity';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { ACCOUNT_ROLE } from 'src/constant/user.constant';

@Injectable()
export class PublishersService {
    constructor(
        @InjectRepository(Publisher)
        private publishersRepository: Repository<Publisher>,
    ) { }

    getAllPublishers(): Promise<Publisher[]> {
        try {
            return this.publishersRepository.find();
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    async createPublisher(req: Request, createPublisherDto: CreatePublisherDto): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }

            const { name } = createPublisherDto

            // Kiểm tra nhà xuất bản đã tồn tại chưa
            const existingPublisher = await this.publishersRepository.findOne({ where: { name } });
            if (existingPublisher) {
                throw new HttpException('Publisher already exists', HttpStatus.BAD_REQUEST);
            }

            const newPublisher = this.publishersRepository.create({
                name
            })
            await this.publishersRepository.save(newPublisher)

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Created publisher successfully.',
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

    async deletePublisher(req: Request, id: number): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }
            await this.publishersRepository.delete({ id });

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.OK,
                message: 'Publisher deleted successfully.',
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
