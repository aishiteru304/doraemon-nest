import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async getAllCategories(): Promise<Category[]> {
        return this.categoriesService.getAllCategories();
    }

    @Post()
    async createCategory(@Req() req: Request, @Body() createCategoryDto: CreateCategoryDto): Promise<ResponseFormat<undefined>> {
        return this.categoriesService.createCategory(req, createCategoryDto)
    }

    @Delete(':id')
    async deleteCategory(@Req() req: Request, @Param('id') id: number): Promise<ResponseFormat<undefined>> {
        return this.categoriesService.deleteCategory(req, id);
    }
}
