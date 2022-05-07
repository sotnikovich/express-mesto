const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use((req, res, next) => {
    req.user = {
        _id: '627636f1e9903435b3700f2c',
    };
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRoutes);
app.use('/cards', cardsRouter);
app.listen(PORT, () => {
    console.log(`Слушаем ${PORT} порт`);
});