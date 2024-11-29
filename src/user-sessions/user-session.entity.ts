import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class UserSession {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    accessToken: string;


}