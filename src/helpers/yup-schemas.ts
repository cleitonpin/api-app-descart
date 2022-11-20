import * as yup from "yup";

yup.setLocale({
  mixed: {
    default: "Campo inválido",
    required: "Campo obrigatório",
    oneOf: "Deve ser um dos seguintes valores: ${values}",
    notOneOf: "Não pode ser um dos seguintes valores: ${values}",
    notType: "Campo inválido",
  },
  string: {
    length: "Deve ter exatamente ${length} caracteres",
    min: "Deve ter pelo menos ${min} caracteres",
    max: "Deve ter no máximo ${max} caracteres",
    email: "Formato de e-mail inválido",
    url: "Deve ter um formato de URL válida",
    trim: "Não deve conter espaços no início ou no fim",
    lowercase: "Deve estar em maiúsculo",
    uppercase: "Deve estar em minúsculo",
  },
  number: {
    min: "Deve ser no mínimo ${min}",
    max: "Deve ser no máximo ${max}",
    lessThan: "Deve ser menor que ${less}",
    moreThan: "Deve ser maior que ${more}",
    positive: "Deve ser um número positivo",
    negative: "Deve ser um número negativo",
    integer: "Deve ser um número inteiro",
  },
  date: {
    min: "Deve ser maior que a data ${min}",
    max: "Deve ser menor que a data ${max}",
  },
  array: {
    min: "Deve ter no mínimo ${min} itens",
    max: "Deve ter no máximo ${max} itens",
  },
});

export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const franchiseSchema = yup.object().shape({
  email: yup.string().email().required(),
  cnpj: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Somente números")
    .max(14)
    .min(14),
  companyName: yup.string().required(),
  password: yup.string().required(),
  address: yup.object().shape({
    street: yup.string().required(),
    city: yup.string().required(),
    uf: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    district: yup.string().required(),
    number: yup.number().required(),
    complement: yup.string().required(),
    coordinates: yup.object().shape({
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    }),
  }),
  type: yup.string(),
});
