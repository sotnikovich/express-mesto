const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.get('/me', getUserMe);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
