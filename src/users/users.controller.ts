import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard';
import { ValidationException } from 'common/exception/validation.exception';
import { Request } from 'express';
import { YupValidationPipe } from 'yup.validation.pipe';
import { CreateUser } from './model';
import { createUserSchema } from './schema/create-user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.getAll();
  }

  @Post()
  @UsePipes(new YupValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUser) {
    try {
      await this.usersService.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      });
    } catch (e) {
      throw new ValidationException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async findProfile(@Req() req: Request) {
    return req.user;
  }
}
