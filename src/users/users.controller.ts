import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<ResponseFormat<undefined>> {
        return this.usersService.register(registerUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<ResponseFormat<ResponseLoginDto>> {
        return this.usersService.login(loginDto);
    }

    @Get('logout')
    async logout(@Req() req: Request) {
        return this.usersService.logout(req);
    }
}