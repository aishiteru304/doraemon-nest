import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';



export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    name: string; // Tên người đặt hàng

    @IsString()
    @IsNotEmpty()
    phone: string; // Số điện thoại

    @IsString()
    @IsNotEmpty()
    address: string; // Địa chỉ giao hàng

    @IsArray()
    @IsNotEmpty()
    orderDetails: CreateOrderDetailDto[]; // Danh sách các chi tiết đơn hàng
}
