import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'auth/guard';
import { createBucketSchema } from './schema/create-bucket.schema';
import { YupValidationPipe } from 'yup.validation.pipe';
import { BucketService } from './bucket.service';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { Bucket } from '.prisma/client';
import { SlugService } from './slug.service';
import { DomainBadRequestException, DomainException } from 'common/exception';

@Controller('bucket')
export class BucketController {
  constructor(
    private readonly bucketService: BucketService,
    private readonly slugService: SlugService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new YupValidationPipe(createBucketSchema))
  @Post()
  async create(
    @Body() body: CreateBucketDto,
    @Req() req: Request,
  ): Promise<Bucket> {
    try {
      return await this.bucketService.create({ ...body, ownerId: req.user.id });
    } catch (err) {
      if (err instanceof DomainException) {
        throw new DomainBadRequestException(err);
      }
    }
  }

  @Get('/suggest-slug')
  async suggestSlug(@Query('title') title: string): Promise<{ slug: string }> {
    try {
      return await this.slugService.generateSlug(title);
    } catch (err) {
      if (err instanceof DomainException) {
        throw new DomainBadRequestException(err);
      }
    }
  }
}
