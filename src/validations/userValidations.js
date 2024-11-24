const Joi = require('joi');

const registerSchema = Joi.object({
    first_name: Joi.string().max(255).required().messages({
        'string.empty': 'Data tidak boleh kosong',
        'any.required': 'Data tidak boleh kosong',
      }),
    last_name: Joi.string().max(255).required().messages({
        'string.empty': 'Data tidak boleh kosong',
        'any.required': 'Data tidak boleh kosong',
      }),
    password: Joi.string().min(8).max(255).required().messages({
        'string.min': 'Password minimal 8 karakter',
        'string.empty': 'Data tidak boleh kosong',
        'any.required': 'Data tidak boleh kosong',
      }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Data tidak boleh kosong',
        'string.email': 'Paramter email tidak sesuai format',
        'any.required': 'Data tidak boleh kosong',
      }),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().max(255).required().messages({
      'string.empty': 'Data tidak boleh kosong',
      'any.required': 'Data tidak boleh kosong',
    }),
  last_name: Joi.string().max(255).required().messages({
      'string.empty': 'Data tidak boleh kosong',
      'any.required': 'Data tidak boleh kosong',
    }),
});

const loginSchema = Joi.object({
    password: Joi.string().min(8).max(255).required().messages({
        'string.min': 'Password minimal 8 karakter',
        'string.empty': 'Data tidak boleh kosong',
        'any.required': 'Data tidak boleh kosong',
      }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Data tidak boleh kosong',
        'string.email': 'Paramter email tidak sesuai format',
        'any.required': 'Data tidak boleh kosong',
      }),
});

const validateRegistration = (data) => {
    const { error } = registerSchema.validate(data, { abortEarly: false });
    if (error) {
      return (error.details.map((e) => e.message).join(', '));
    }
  };

  const validateUpdateUser = (data) => {
    const { error } = updateUserSchema.validate(data, { abortEarly: false });
    if (error) {
      return(error.details.map((e) => e.message).join(', '));
    }
  };

  const validateLogin = (data) => {
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
      return (error.details.map((e) => e.message).join(', '));
    }
  };
  
module.exports = { validateRegistration,validateLogin,validateUpdateUser };