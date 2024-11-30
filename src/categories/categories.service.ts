import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { ACCOUNT_ROLE } from 'src/constant/user.constant';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    getAllCategories(): Promise<Category[]> {
        try {
            return this.categoriesRepository.find();
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    async createCategory(req: Request, createCategoryDto: CreateCategoryDto): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }

            const { name } = createCategoryDto

            // Kiểm tra loại đã tồn tại chưa
            const existingCategory = await this.categoriesRepository.findOne({ where: { name } });
            if (existingCategory) {
                throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
            }

            const newCategory = this.categoriesRepository.create({
                name
            })
            await this.categoriesRepository.save(newCategory)

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Created category successfully.',
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

    async deleteCategory(req: Request, id: number): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }
            await this.categoriesRepository.delete({ id });

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.OK,
                message: 'Category deleted successfully.',
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
