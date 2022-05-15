const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const Unauthorized = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователя не существует');
      return res.send(user);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователя не существует');

      return res.send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const avatar = req.body;
  return User.findByIdAndUpdate(req.params.userId, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователя не существует');
      return res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new Unauthorized('Пользователя не существует');
      bcrypt.compare(password, user.password, ((err, isValid) => {
        if (err) throw new Forbidden(err);
        if (!isValid) throw new Forbidden('Неправильный пароль');
        if (isValid) {
          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
          }).send({
            name: user.name, about: user.about, avatar: user.avatar, email: user.email,
          });
        }
      }));
    })
    .catch(next);
};
