import { BadRequestException } from '@nestjs/common';
import { AlreadyInUse } from './already-in-use.data';

export class ValidationException extends BadRequestException {
  constructor(errorObject: { code: string; meta: { target: string } }) {
    super(
      errorObject.code === 'P2002'
        ? new AlreadyInUse(errorObject.meta.target.split('_')[1])
        : {},
    );
  }
}
