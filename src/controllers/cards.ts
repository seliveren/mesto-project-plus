import { Request, Response } from 'express';
import Card from '../models/card';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';
import { notFoundError, defaultError, incorrectInputError } from '../constants/constants';

export const findAllCards = (req: Request, res: Response) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === '404 Not Found') { return res.status(notFoundError).send({ message: 'Запрашиваемые карточки не найдены' }); }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const createCard = (req: IUserAuthInfoRequest, res: Response) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === '400 Bad Request') { return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные при создании карточки' }); }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === '404 Not Found') { return res.status(notFoundError).send({ message: 'Карточка с указанным _id не найдена' }); }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const likeCard = (req: IUserAuthInfoRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === '400 Bad Request') {
        return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};

export const dislikeCard = (req: IUserAuthInfoRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === '400 Bad Request') {
        return res.status(incorrectInputError).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err.name === '404 Not Found') {
        return res.status(notFoundError).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(defaultError).send({ message: 'Ошибка со стороны сервера' });
    });
};
