const { celebrate, Joi } = require('celebrate');

const validateUrl = (value, helpers) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

  if (!regex.test(value)) {
    return helpers.error('Ссылка не валидна');
  }
  return value;
};

const userValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: Joi.string().required().min(2).max(100),
  }),
});

const userAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
});

const userValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).max(100),
  }),
});

module.exports = {
  userValidation, cardValidation, idValidation, loginValidation, userAvatarValid, userValid,
};
