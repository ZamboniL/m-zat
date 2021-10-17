export interface CreateUserDto {
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}
