import { ACCOUNT_ROLE, USER_STATUS } from 'src/constant/user.constant';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: USER_STATUS.INACTIVE })
    status: USER_STATUS;

    @Column({ default: ACCOUNT_ROLE.USER })
    role: ACCOUNT_ROLE;
}