const { celebrate, Joi } = require('celebrate');
const express = require('express');
const userControllers = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', userControllers.findAllUsers);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), userControllers.findUserById);
userRouter.get('/me', userControllers.getCurrentUser);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string(),
  }),
}), userControllers.editProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), userControllers.editAvatar);

module.exports = userRouter;

export default userRouter;
