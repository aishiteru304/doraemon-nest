import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Publisher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

}