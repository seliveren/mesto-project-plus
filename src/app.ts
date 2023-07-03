import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import auth from './middlewares/auth';
import { login, createUser } from './controllers/users';
import { reqLogger, errLogger } from './middlewares/logger';
import { IError } from './interfaces/IError';
import { defaultError } from './constants/constants';

const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const { PORT = 3000 } = process.env;
const { DB = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB);

app.use(express.json());

app.use(reqLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use(errLogger);

app.use((err: IError, req: Request, res: Response) => {
  const { statusCode = defaultError, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === defaultError
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
