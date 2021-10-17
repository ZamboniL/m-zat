import { Bucket, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { SlugService } from './slug.service';

@Injectable()
export class BucketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly slugService: SlugService,
  ) {}

  async create(bucket: Prisma.BucketUncheckedCreateInput): Promise<Bucket> {
    await this.slugService.checkIfAlreadyInUse(bucket.slug);

    return this.prismaService.bucket.create({
      data: bucket,
    });
  }
}
