import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    oneOf: '${path} precisa ser igual a ${values}.',
    required: '${path} é obrigatório.',
    notType: '${path} precisa ser de tipo ${type}.',
  },
  string: {
    min: '${path} precisa de no mínimo ${min} caracteres.',
    max: '${path} tem um limite de ${max} caracteres.',
    email: '${path} precisa ser um e-mail válido.',
  },
});

export default Yup;
