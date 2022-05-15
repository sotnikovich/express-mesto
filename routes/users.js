const express = require('express');

const router = express.Router();
const { idValidation } = require('../middlewares/validation');

const {
  getUser, findUser,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:id', idValidation, findUser);

module.exports = router;
