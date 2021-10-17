import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy, LocalStrategy } from 'auth/strategy';
import { AuthService } from 'auth/auth.service';
import { UsersModule } from 'users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '8h' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('returns the user when it is valid', async () => {
      const mockUser = {
        id: 98776,
        name: 'Joao Silva',
        email: 'joao@email.com',
      };

      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation(async () => mockUser);

      expect(await strategy.validate(mockUser.email, '123456')).toBe(mockUser);
    });

    it('throws unauthorized exception when the user is invalid', async () => {
      const mockUser = {
        id: 98776,
        name: 'Joao Silva',
        email: 'joao@email.com',
      };

      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation(async () => null);

      await expect(
        async () => await strategy.validate(mockUser.email, '123456'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
