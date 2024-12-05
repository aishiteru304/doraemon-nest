import { IsOptional, IsString, IsNumber } from 'class-validator';

export class EditBookDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    quantity?: number;
}