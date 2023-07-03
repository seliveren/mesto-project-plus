const express = require('express');
const { celebrate, Joi } = require('celebrate');
const cardControllers = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', cardControllers.findAllCards);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), cardControllers.createCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), cardControllers.deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), cardControllers.likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), cardControllers.dislikeCard);

module.exports = cardRouter;

export default cardRouter;
