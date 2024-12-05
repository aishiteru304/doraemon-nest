import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { ACCOUNT_ROLE } from 'src/constant/user.constant';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Category } from 'src/categories/category.entity';
import { Author } from 'src/authors/author.entity';
import { Publisher } from 'src/publishers/publisher.entity';
import { EditBookDto } from './dto/edit-book.dto';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        @InjectRepository(Publisher)
        private publisherRepository: Repository<Publisher>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    getAllBooks(): Promise<Book[]> {
        try {
            return this.bookRepository.find();
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async createBook(
        req: Request,
        // file: Express.Multer.File,
        createBookDto: CreateBookDto,
    ): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role !== ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }


            if (!createBookDto.file) {
                throw new HttpException('Image is required', HttpStatus.BAD_REQUEST);
            }

            // Tìm kiếm các entity dựa trên ID
            const category = await this.categoryRepository.findOne({
                where: { id: createBookDto.categoryId },
            });
            const author = await this.authorRepository.findOne({
                where: { id: createBookDto.authorId },
            });
            const publisher = await this.publisherRepository.findOne({
                where: { id: createBookDto.publisherId },
            });

            if (!category || !author || !publisher) {
                throw new HttpException('CategoryID or authorID or publisherID not exist', HttpStatus.NOT_FOUND);
            }

            // Upload file lên Cloudinary và lấy URL
            const fileUrl = await this.cloudinaryService.uploadFile(createBookDto.file);



            // Tạo book mới trong database
            const newBook = this.bookRepository.create({
                image: fileUrl.url, // Lưu URL của ảnh
                name: createBookDto.name,
                price: createBookDto.price,
                quantity: createBookDto.quantity,
                category,
                author,
                publisher
            });
            await this.bookRepository.save(newBook);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Book created successfully.',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async editBook(req: Request, id: number, editBookDto: EditBookDto): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role !== ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }

            const existBook = await this.bookRepository.findOne({
                where: { id: id }
            })

            if (!existBook) {
                throw new HttpException('Book not exist', HttpStatus.NOT_FOUND);
            }

            // Cập nhật các trường với dữ liệu mới từ DTO
            const updatedBook = this.bookRepository.merge(existBook, editBookDto);
            await this.bookRepository.save(updatedBook)

            return {
                statusCode: HttpStatus.OK,
                message: 'Book updated successfully.',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteBook(req: Request, id: number): Promise<ResponseFormat<undefined>> {
        try {
            const user = req['user'];
            if (user.role != ACCOUNT_ROLE.ADMIN) {
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }
            await this.bookRepository.delete({ id });

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.OK,
                message: 'Book deleted successfully.',
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