import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';
import { incorrectInputError } from '../constants/constants';

const NotFoundErr = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request');
const ForbiddenErr = require('../errors/forbidden-err');

export const findAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Запрашиваемые карточки не найдены');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const createCard = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => {
      if (!card) {
        throw new BadRequestErr('Переданы некорректные данные при создании карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const deleteCard = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId).then((cardBody) => {
    if (cardBody?.owner.valueOf() !== req.user?._id) {
      throw new ForbiddenErr('Вы не можете удалять карточки других пользователей');
    } if (cardBody?.owner.valueOf() === req.user?._id) {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          if (!card) {
            throw new NotFoundErr('Карточка с указанным _id не найдена');
          }
          res.send({ data: card });
        })
        .catch(next);
    }
  }).catch(next);
};

export const likeCard = (
  req: IUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        throw new NotFoundErr('Передан несуществующий _id карточки');
      }
      res.send({ data: likes });
    })
    .catch((err) => {
      if (err.statusCode === incorrectInputError) {
        next(BadRequestErr('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

export const dislikeCard = (
  req: IUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        throw new NotFoundErr('Передан несуществующий _id карточки');
      }
      res.send({ data: likes });
    })
    .catch((err) => {
      if (err.statusCode === incorrectInputError) {
        next(BadRequestErr('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};
