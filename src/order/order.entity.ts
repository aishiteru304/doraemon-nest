import { ORDER_STATUS } from 'src/constant/order.constant';
import { OrderDetail } from 'src/order-detail/order-detail.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    name: string;

    @Column({ default: ORDER_STATUS.PENDING })
    orderStatus: ORDER_STATUS

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
    @JoinColumn({ name: 'orderDetails' })
    orderDetails: OrderDetail[];

}