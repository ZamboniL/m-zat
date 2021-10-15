import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'users/users.service';
import { AuthenticatedUser } from './model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findOne({ email });
    const validPassword = await this.compareHash(password, user.password);

    if (validPassword) {
      const { password: _, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: AuthenticatedUser): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
