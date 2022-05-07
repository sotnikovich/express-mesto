const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => {
            res.status(200).send(users);
        })
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
    User.findById(req.params.id)
        .orFail(new Error('IncorrectID'))
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            if (err.message === 'IncorrectID') {
                res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
            }
            res.status(500).send({ message: 'Произошла ошибка' });
        });
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
        .orFail(new Error('IncorrectID'))
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные даные' });
            }
            return res.status(500).send({ message: 'Произошла ошибка' });
        });
};

module.exports.updateUser = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about })
        .orFail(new Error('IncorrectID'))
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные даные при обновлении профиля' });
            }
            if (err.message === 'IncorrectID') {
                return new NotFoundError('Пользователь с указанным _id не найден');
            }
            return res.status(500).send({ message: 'Произошла ошибка' });
        });
};

module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные даные при обновлении профиля' });
            }
            if (err.message === 'IncorrectID') {
                return new NotFoundError('Пользователь с указанным _id не найден');
            }
            return res.status(500).send({ message: 'Произошла ошибка' });
        });
};