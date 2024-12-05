import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
    @IsNotEmpty()
    file: Express.Multer.File; // File upload

    @IsString()
    @IsNotEmpty()
    name: string; // Tên sách

    @IsNumber()
    @Type(() => Number) // Chuyển đổi kiểu dữ liệu nếu đầu vào là chuỗi
    @IsNotEmpty()
    price: number; // Giá sách

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    quantity: number; // Số lượng sách

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    authorId: number; // ID của tác giả

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    categoryId: number; // ID của thể loại

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    publisherId: number; // ID của nhà xuất bản
}
