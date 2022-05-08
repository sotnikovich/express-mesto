const router = require('express').Router();

router.use((req, res) => {
  res.status(404).send({ message: 'Данный путь не найден' });
});

module.exports = router;
