import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }


    @Post()
    async createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(req, createOrderDto);
    }

    @Get()
    async getOrderByUser(@Req() req: Request) {
        return this.orderService.getOrderByUser(req);
    }
}
