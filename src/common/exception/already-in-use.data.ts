export class AlreadyInUse {
  readonly message = 'Validation Error';
  readonly error: string[];
  constructor(field: string) {
    this.error = [`este ${field} já está sendo utilizado`];
    return this;
  }
}
