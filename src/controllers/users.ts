import { Request, Response } from 'express';
import User from '../models/user';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';
import { defaultError, incorrectInputError, notFoundError } from '../constants/constants';

export const findAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Запрашиваемые пользователи не найдены' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const findUserById = (req: IUserAuthInfoRequest, res: Response) => {
  User.findById(req.user?._id)
    .then((user) => res.send({
      name: user?.name,
      about: user?.about,
      avatar: user?.avatar,
      _id: user?._id,
    }))
    .catch((err) => {
      if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === '400 Bad Request') {
        return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const editProfile = (req: IUserAuthInfoRequest, res: Response) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { name: 'Тестовый пользователь', about: 'Информация' },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === '400 Bad Request') {
        return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const editAvatar = (req: IUserAuthInfoRequest, res: Response) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: 'https://i.pravatar.cc/150?img=2' },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === '400 Bad Request') {
        return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};
