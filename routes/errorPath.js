const router = require('express').Router();
const userRoute = require('./users');
const cardsRoute = require('./cards');

router.use('/', userRoute);
router.use('/', cardsRoute);

router.use((req, res) => {
    res.status(404).send({ message: 'Данный путь не найден' });
});

module.exports = router;