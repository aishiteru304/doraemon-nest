import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Order } from './order.entity';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';
import { Book } from 'src/books/book.entity';
import { OrderDetail } from 'src/order-detail/order-detail.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createOrder(req: Request, createOrderDto: CreateOrderDto) {
        try {
            const user = req['user'];

            // Lấy thông tin User
            const userInfor = await this.userRepository.findOne({ where: { id: user.id } });
            if (!userInfor) {
                throw new Error('User không tồn tại');
            }

            const { name, phone, address, orderDetails } = createOrderDto;

            // Tạo Order
            const order = this.orderRepository.create({
                name,
                phone,
                address,
                user: userInfor,
            });

            // Lưu Order
            const savedOrder = await this.orderRepository.save(order);

            // Tạo các OrderDetail
            const orderDetailsEntities = await Promise.all(
                orderDetails.map(async (detail: CreateOrderDetailDto) => {
                    const book = await this.bookRepository.findOne({ where: { id: detail.bookId } });
                    if (!book) {
                        throw new Error(`Sách với ID ${detail.bookId} không tồn tại`);
                    }
                    return this.orderDetailRepository.create({
                        book,
                        price: detail.price,
                        quantity: detail.quantity,
                        order: savedOrder,
                    });
                }),
            );

            // Lưu các OrderDetail
            await this.orderDetailRepository.save(orderDetailsEntities);


            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Create order successfully.',
            };
        } catch (error) {
            // Kiểm tra nếu lỗi là một HttpException
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getOrderByUser(req: Request) {
        try {
            const user = req['user'];
            return this.orderRepository.find({
                where: { user: { id: user.id } },
                relations: ['orderDetails', 'orderDetails.book'], // Include các quan hệ cần thiết
            });

        } catch (error) {
            // Kiểm tra nếu lỗi là một HttpException
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
