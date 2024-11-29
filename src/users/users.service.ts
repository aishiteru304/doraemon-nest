import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'
import { ACCOUNT_ROLE } from 'src/constant/user.constant';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseFormat } from 'src/interfaces/response.interface';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from 'src/user-sessions/user-session.entity';
import { ResponseLoginDto } from './dto/response-login.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserSession)
        private userSessionsRepository: Repository<UserSession>,
        private readonly jwtService: JwtService
    ) { }

    findAll(): Promise<User[]> {
        try {
            return this.usersRepository.find({
                where: { role: ACCOUNT_ROLE.USER },
            });
        }
        catch (error) {
            throw new HttpException("SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    async register(registerUserDto: RegisterUserDto): Promise<ResponseFormat<undefined>> {

        try {

            const { username, email, password } = registerUserDto;

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await this.usersRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }

            // Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = this.usersRepository.create({
                username,
                email,
                password: hashedPassword,
            });

            // Lưu vào cơ sở dữ liệu
            await this.usersRepository.save(newUser);

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User registered successfully.',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginDto: LoginDto): Promise<ResponseFormat<ResponseLoginDto>> {

        try {

            const { email, password } = loginDto;

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await this.usersRepository.findOne({ where: { email } });
            if (!existingUser) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            // Kiểm tra mật khẩu có chính xác không
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            // Tạo access token
            const accessToken = this.jwtService.sign({ id: existingUser.id });

            // Kiểm tra user có trong user session không
            const existingUserSession = await this.userSessionsRepository.findOne({
                where: {
                    user: { id: existingUser.id }
                }
            });

            // Nếu đã tồn tại, cập nhật cột accessToken
            if (existingUserSession) {
                existingUserSession.accessToken = accessToken;
                await this.userSessionsRepository.save(existingUserSession);
            }
            else {
                // Nếu chưa tồn tại, tạo mới một session
                const newUserSession = this.userSessionsRepository.create({
                    user: existingUser,
                    accessToken,
                });
                await this.userSessionsRepository.save(newUserSession);
            }

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User registered successfully.',
                data: { accessToken, username: existingUser.username, role: existingUser.role }
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async logout(@Req() req: Request) {
        try {
            const user = req['user'];

            await this.userSessionsRepository.delete({ id: user.id });

            // Trả về phản hồi thành công
            return {
                statusCode: HttpStatus.OK,
                message: 'Logged out successfully.',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
