import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);

    return this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
  }

  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where });
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    return bcrypt.hash(password, rounds);
  }
}
