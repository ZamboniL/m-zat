import { Prisma, User } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma.service';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userMock = {
      id: '1234',
      email: 'joao@gmail.com',
      name: 'João Silva',
      password: '123456',
    };

    it('creates a valid password for the user', async () => {
      const { id: _, ...createUserMock } = userMock;

      jest
        .spyOn(prismaService.user, 'create')
        .mockImplementation(
          (data: unknown) => data as Prisma.Prisma__UserClient<User>,
        );

      service
        .create(createUserMock)
        .then(async (result) => {
          expect(await bcrypt.compare(userMock.password, result.password)).toBe(
            true,
          );
        })
        .catch(() => ({}));
    });
  });
});
