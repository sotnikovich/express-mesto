const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.status(200).send({ cards });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => res.status(err.message ? 400 : 500).send({ message: err.message || 'Ошибка на сервере' }));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        res.status(200).send({ data: card, message: 'Карточка удалена' });
      } else {
        next(new Forbidden('Карточку создал другой пользователь'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest({ message: 'Переданы некорректные данные' }));
      }
      next(err);
    });
};
