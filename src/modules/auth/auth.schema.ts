import Joi from '@hapi/joi';

export const RegistrationSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(12)
    .alphanum()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .max(32)
    .required(),
});
