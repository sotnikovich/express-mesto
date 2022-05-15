const express = require('express');

const router = express.Router();
const { idValidation, userAvatarValid, userValid } = require('../middlewares/validation');

const {
  getUser, findUser, getUserMe, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:id', idValidation, findUser);
router.get('/me', getUserMe);
router.patch('/me', userValid, updateUser);
router.patch('/me/avatar', userAvatarValid, updateAvatar);

module.exports = router;
