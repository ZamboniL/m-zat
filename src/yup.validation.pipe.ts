import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AnyObjectSchema } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema: AnyObjectSchema) {}

  transform(value: any) {
    try {
      this.schema.validateSync(value);
    } catch (error) {
      throw new BadRequestException('Validation failed', error.errors);
    }
    return value;
  }
}
