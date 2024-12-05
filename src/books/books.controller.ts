import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { EditBookDto } from './dto/edit-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    async getAllCategories(): Promise<Book[]> {
        return this.booksService.getAllBooks();
    }

    @Post()
    // @UseInterceptors(FileInterceptor('file'))
    @FormDataRequest()
    async createBook(@Req() req: Request, @Body() createBookDto: CreateBookDto): Promise<ResponseFormat<undefined>> {
        return this.booksService.createBook(req, createBookDto)
    }

    @Patch(":id")
    async editBook(@Req() req: Request, @Param('id') id: number, @Body() editBookDto: EditBookDto): Promise<ResponseFormat<undefined>> {
        return this.booksService.editBook(req, id, editBookDto)
    }

    @Delete(":id")
    async deleteBook(@Req() req: Request, @Param('id') id: number): Promise<ResponseFormat<undefined>> {
        return this.booksService.deleteBook(req, id)
    }

}
