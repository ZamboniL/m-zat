import { Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { PrismaService } from 'prisma.service';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { SlugService } from './slug.service';

@Module({
  imports: [AuthModule],
  controllers: [BucketController],
  providers: [BucketService, SlugService, PrismaService],
})
export class BucketModule {}
