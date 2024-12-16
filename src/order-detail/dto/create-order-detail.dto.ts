import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDetailDto {
    @IsNumber()
    @IsNotEmpty()
    bookId: number; // ID của sách

    @IsNumber()
    @IsNotEmpty()
    price: number; // Giá sách

    @IsNumber()
    @IsNotEmpty()
    quantity: number; // Số lượng
}