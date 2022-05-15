const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) throw new Unauthorized('Необходима авторизация');
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secretno04en');
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }
  req.user = payload;
  next();
};
