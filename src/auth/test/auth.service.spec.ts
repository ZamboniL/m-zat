import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from 'users/users.module';
import { UsersService } from 'users/users.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let jwtService: JwtService;
  let usersService: UsersService;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '8h' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('correctly compares the hash', async () => {
      const reqMock = { email: 'teste@email.com', password: '123456' };
      const userMock = {
        id: '1',
        email: 'teste@email.com',
        name: 'João Silva',
        password:
          '$2b$10$/Th1/IqbOIYMl1YawyTSqOnc6IVIPYFofhjBQx4g9fAzlR9AD5kA2', // hash for the 123456 password
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => userMock);

      const { password: _, ...result } = userMock;

      expect(
        await service.validateUser(reqMock.email, reqMock.password),
      ).toStrictEqual(result);
    });

    it('will return null if the password does not checkout', async () => {
      const reqMock = { email: 'teste@email.com', password: '123456' };
      const userMock = {
        id: '1',
        email: 'teste@email.com',
        name: 'João Silva',
        password: 'invalidHash',
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => userMock);

      expect(
        await service.validateUser(reqMock.email, reqMock.password),
      ).toStrictEqual(null);
    });
  });

  describe('login', () => {
    it('returns the token given by the jwtService', async () => {
      const jwtMock =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      jest.spyOn(jwtService, 'sign').mockImplementation(() => jwtMock);

      expect(
        await service.login({
          email: 'teste@gmail.com',
          id: '1234',
          name: 'João Silva',
        }),
      ).toStrictEqual({ accessToken: jwtMock });
    });
  });
});
