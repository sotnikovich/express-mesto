const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { userValidation, loginValidation } = require('./middlewares/validation');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: 'https://felaw.mesto.nomoreparties.sbs',
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', userValidation, createUser);
app.post('/signin', loginValidation, login);
app.use(auth);
app.use(require('./routes/errorPath'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT);
