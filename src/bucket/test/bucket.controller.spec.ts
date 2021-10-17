import { Bucket } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { BucketService } from 'bucket/bucket.service';
import { SlugService } from 'bucket/slug.service';
import { DomainBadRequestException, DomainException } from 'common/exception';
import { Request } from 'express';
import { PrismaService } from 'prisma.service';
import { BucketController } from '../bucket.controller';

describe('BucketController', () => {
  let controller: BucketController;
  let bucketService: BucketService;
  let slugService: SlugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BucketController],
      providers: [PrismaService, BucketService, SlugService],
    }).compile();

    controller = module.get<BucketController>(BucketController);
    bucketService = module.get<BucketService>(BucketService);
    slugService = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createBucketMock = {
      slug: 'bla-bla',
      title: 'My Bucket',
      description: 'This is my bucket',
    };

    const requestMock = { user: { id: 1 } } as Request;

    it('should throw an DomainBadRequest when a DomainException is thrown', async () => {
      jest.spyOn(bucketService, 'create').mockImplementation(async () => {
        throw new DomainException('test', { err: 'err' });
      });

      let err;
      try {
        await controller.create(createBucketMock, requestMock);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(DomainBadRequestException);
    });

    it('should return an value if not thrown', async () => {
      jest
        .spyOn(bucketService, 'create')
        .mockImplementation(async (data: Bucket) => data);

      expect(
        await controller.create(createBucketMock, requestMock),
      ).toBeTruthy();
    });
  });

  describe('suggestSlug', () => {
    const titleMock = 'My Bucket';

    it('should throw an DomainBadRequest when a DomainException is thrown', async () => {
      jest.spyOn(slugService, 'generateSlug').mockImplementation(async () => {
        throw new DomainException('test', { err: 'err' });
      });

      let err;
      try {
        await controller.suggestSlug(titleMock);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(DomainBadRequestException);
    });

    it('should return an value if not thrown', async () => {
      jest
        .spyOn(slugService, 'generateSlug')
        .mockImplementation(async (data: string) => ({
          slug: data,
        }));

      expect(await controller.suggestSlug(titleMock)).toBeTruthy();
    });
  });
});
