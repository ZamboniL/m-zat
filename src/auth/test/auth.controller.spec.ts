import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthController } from '../auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from 'auth/strategy';
import { LocalAuthGuard } from 'auth/guard';
import { CanActivate } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const mock_ForceFailGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '8h' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      controllers: [AuthController],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockUser = { id: 9000 };

    it('will return the result of service.login', async () => {
      jest
        .spyOn(service, 'login')
        .mockImplementation(async () => ({ accessToken: 'token' }));

      expect(
        await controller.login({
          user: mockUser,
        } as Request),
      ).toStrictEqual({ accessToken: 'token' });
    });

    it('passes user to service.login', async () => {
      const mockLogin = jest.fn(async () => ({
        accessToken: 'token',
      }));

      jest.spyOn(service, 'login').mockImplementation(mockLogin);

      await controller.login({
        user: mockUser,
      } as Request);

      expect(mockLogin).toHaveBeenCalledWith(mockUser);
    });
  });
});
