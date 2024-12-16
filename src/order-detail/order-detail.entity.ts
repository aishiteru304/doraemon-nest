import { Book } from 'src/books/book.entity';
import { Order } from 'src/order/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Book, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => Order, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

}