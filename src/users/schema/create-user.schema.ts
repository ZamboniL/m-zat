import Yup from 'validator';

export const createUserSchema = Yup.object({
  name: Yup.string().required().min(3).max(120).label('nome'),
  email: Yup.string().required().email().label('e-mail'),
  confirmEmail: Yup.string()
    .required()
    .oneOf([Yup.ref('email')], '${path} precisa ser igual ao e-mail.')
    .label('confirmar e-mail'),
  password: Yup.string().required().min(6).label('senha'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], '${path} precisa ser igual a senha.')
    .label('confirmar senha'),
});
