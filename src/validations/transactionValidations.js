const Joi = require('joi');

const userTopupSchema = Joi.object({
    top_up_amount :  Joi.number().greater(0).required().messages({
        'number.empty': 'Data tidak boleh kosong',
        'number.greater': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        'any.required': 'Data tidak boleh kosong',
      }),
   
});

const validateUserTopup = (data) => {
    const { error } = userTopupSchema.validate(data, { abortEarly: false });
    if (error) {
      return (error.details.map((e) => e.message).join(', '));
    }
  };

  
  
module.exports = { validateUserTopup };