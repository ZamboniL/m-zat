import { AuthenticatedUserDto } from './dto';

declare global {
  namespace Express {
    interface User extends AuthenticatedUserDto {}
  }
}
