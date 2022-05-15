const express = require('express');

const router = express.Router();

const { idValidation, cardValidation } = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:id', idValidation, deleteCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
