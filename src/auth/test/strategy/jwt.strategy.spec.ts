import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from 'auth/strategy';

describe('LocalStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const mockJwtDecoded = {
      sub: '1234',
      email: 'joao@gmail.com',
      exp: '12-14-2028',
      iat: '12-14-2028',
    };
    it('will return the sub from JWT as the id', () => {
      expect(strategy.validate(mockJwtDecoded)).toStrictEqual({
        id: mockJwtDecoded.sub,
      });
    });
  });
});
