import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { Publisher } from './publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';

@Controller('publishers')
export class PublishersController {
    constructor(private readonly publishersService: PublishersService) { }

    @Get()
    async getAllPublishers(): Promise<Publisher[]> {
        return this.publishersService.getAllPublishers();
    }

    @Post()
    async createPublisher(@Req() req: Request, @Body() createPublisherDto: CreatePublisherDto): Promise<ResponseFormat<undefined>> {
        return this.publishersService.createPublisher(req, createPublisherDto)
    }

    @Delete(':id')
    async deletePublisher(@Req() req: Request, @Param('id') id: number): Promise<ResponseFormat<undefined>> {
        return this.publishersService.deletePublisher(req, id);
    }
}
