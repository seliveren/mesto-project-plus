import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from './middlewares/authMiddleware';

const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const { PORT = 3000 } = process.env;
const { DB = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB);

app.use(authMiddleware);
app.use(express.json());
app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
