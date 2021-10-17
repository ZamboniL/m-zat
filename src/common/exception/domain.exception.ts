export class DomainException {
  constructor(
    readonly message: string,
    readonly error: Record<string, unknown>,
  ) {}
}
