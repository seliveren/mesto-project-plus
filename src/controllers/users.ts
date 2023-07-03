import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';
import { IUser } from '../interfaces/IUser';
import { incorrectInputError } from '../constants/constants';

const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict-err');

export const findAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемые пользователи не найдены');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const findUserById = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({
        name: user?.name,
        about: user?.about,
        avatar: user?.avatar,
        _id: user?._id,
      });
    })
    .catch(next);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email,
  } = req.body;

  User.findOne({ email: req.body.email }).then((user) => {
    if (user?.email === email) {
      throw new ConflictError('Пользователь с данным email уже существует');
    }
  }).catch(next);

  bcrypt.hash(req.body.password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user: IUser) => {
      if (!user) {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const editProfile = (
  req: IUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === incorrectInputError) {
        next(BadRequestError('Переданы некорректные данные при редактировании пользователя'));
      }
      next(err);
    });
};

export const editAvatar = (
  req: IUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === incorrectInputError) {
        next(BadRequestError('Переданы некорректные данные при редактировании аватара'));
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

export const getCurrentUser = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};
