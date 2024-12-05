import { Author } from 'src/authors/author.entity';
import { Category } from 'src/categories/category.entity';
import { Publisher } from 'src/publishers/publisher.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    name: string;


    @ManyToOne(() => Author, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'authorId' })
    author: Author;

    @ManyToOne(() => Category, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => Publisher, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'publisherId' })
    publisher: Publisher;

}