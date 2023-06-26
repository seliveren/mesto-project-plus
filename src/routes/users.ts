const express = require('express');
const userControllers = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', userControllers.findAllUsers);
userRouter.get('/:userId', userControllers.findUserById);
userRouter.post('/', userControllers.createUser);
userRouter.patch('/me', userControllers.editProfile);
userRouter.patch('/me/avatar', userControllers.editAvatar);

module.exports = userRouter;

export default userRouter;
