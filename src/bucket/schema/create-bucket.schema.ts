import Yup from 'validator';

export const createBucketSchema = Yup.object({
  title: Yup.string().required().max(100).min(3).label('titulo'),
  description: Yup.string().max(500).label('descrição'),
});
