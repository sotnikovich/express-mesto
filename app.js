const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorPathRouter = require('./routes/errorPath');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registerValid, loginValid } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);
app.use(errorPathRouter);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRouter);

app.listen(PORT);
