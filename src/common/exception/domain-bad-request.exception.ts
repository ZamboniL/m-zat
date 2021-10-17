import { BadRequestException } from '@nestjs/common';
import { DomainException } from './domain.exception';

export class DomainBadRequestException extends BadRequestException {
  constructor(readonly domainException: DomainException) {
    super({ message: domainException.message, error: domainException.error });
  }
}
