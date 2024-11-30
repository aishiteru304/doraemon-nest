import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from './author.entity';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { Request } from 'express';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
export class AuthorsController {

    constructor(private readonly authorsService: AuthorsService) { }

    @Get()
    async getAllAuthors(): Promise<Author[]> {
        return this.authorsService.getAllAuthors();
    }

    @Post()
    async createAuthor(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto): Promise<ResponseFormat<undefined>> {
        return this.authorsService.createAuthor(req, createAuthorDto)
    }

    @Delete(':id')
    async deleteAuthor(@Req() req: Request, @Param('id') id: number): Promise<ResponseFormat<undefined>> {
        return this.authorsService.deleteAuthor(req, id);
    }
}
