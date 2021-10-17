import { Bucket, Prisma } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from 'bucket/slug.service';
import { PrismaService } from 'prisma.service';
import { BucketService } from '../bucket.service';

describe('BucketService', () => {
  let service: BucketService;
  let slugService: SlugService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BucketService, PrismaService, SlugService],
    }).compile();

    service = module.get<BucketService>(BucketService);
    slugService = module.get<SlugService>(SlugService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a value when the check does not throw', async () => {
      jest
        .spyOn(slugService, 'checkIfAlreadyInUse')
        .mockImplementation(async () => false);

      jest
        .spyOn(prismaService.bucket, 'create')
        .mockImplementation(
          (data: unknown) => data as Prisma.Prisma__BucketClient<Bucket>,
        );

      expect(
        await service.create({ title: 'bla', slug: 'bla-bla', ownerId: 1 }),
      ).toBeTruthy();
    });

    it('should throw when the check throws', async () => {
      jest
        .spyOn(slugService, 'checkIfAlreadyInUse')
        .mockImplementation(async (slug: string) => {
          if (slug === 'bla-bla') throw new Error();
          return false;
        });

      let error;
      try {
        await service.create({ title: 'bla', slug: 'bla-bla', ownerId: 1 });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
    });
  });
});
