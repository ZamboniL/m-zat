import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'users/users.service';
import { AuthenticatedUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserDto | null> {
    const user = await this.usersService.findOne({ email });
    const validPassword = await this.compareHash(password, user.password);

    if (validPassword) {
      return { id: user.id };
    }

    return null;
  }

  async login(user: AuthenticatedUserDto): Promise<{ accessToken: string }> {
    const payload = { sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
