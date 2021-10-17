import { Bucket, Prisma } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from 'bucket/slug.service';
import { DomainException } from 'common/exception';
import { PrismaService } from 'prisma.service';

describe('SlugService', () => {
  let service: SlugService;
  let prismaService: PrismaService;
  const slug = 'abcd-efgh';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugService, PrismaService],
    }).compile();

    service = module.get<SlugService>(SlugService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIfAlreadyInUse', () => {
    it('should throw DomainException when another bucket with that slug is found', async () => {
      jest
        .spyOn(prismaService.bucket, 'findUnique')
        .mockImplementation(
          (data: unknown) => data as Prisma.Prisma__BucketClient<Bucket>,
        );

      let error: any;
      try {
        await service.checkIfAlreadyInUse(slug);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(DomainException);
    });

    it('recommends different options with randomized numbers at the end', async () => {
      jest
        .spyOn(prismaService.bucket, 'findUnique')
        .mockImplementation(
          (data: unknown) => data as Prisma.Prisma__BucketClient<Bucket>,
        );

      let error: any;
      try {
        await service.checkIfAlreadyInUse(slug);
      } catch (e) {
        error = e;
      }

      const expectedMatchRegex = new RegExp(`${slug}-[0-9]{4}`);

      expect(error.error).toHaveProperty('suggestions');
      expect(error.error.suggestions[0]).toMatch(expectedMatchRegex);
    });

    it('must return false when another bucket with that slug is not found', async () => {
      jest
        .spyOn(prismaService.bucket, 'findUnique')
        .mockImplementation(() => null);

      expect(await service.checkIfAlreadyInUse(slug)).toBe(false);
    });
  });

  describe('generateSlug', () => {
    it('formats the slug string as expected', async () => {
      jest
        .spyOn(service, 'checkIfAlreadyInUse')
        .mockImplementation(async () => false);

      const title = 'AbcD efgH~~~_]]]';

      expect(await service.generateSlug(title)).toStrictEqual({ slug });
    });
  });
});
