import { AuthenticatedUser } from './model';

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}
