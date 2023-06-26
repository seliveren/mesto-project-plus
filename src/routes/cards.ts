const express = require('express');
const cardControllers = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', cardControllers.findAllCards);
cardRouter.post('/', cardControllers.createCard);
cardRouter.delete('/:cardId', cardControllers.deleteCard);
cardRouter.put('/:cardId/likes', cardControllers.likeCard);
cardRouter.delete('/:cardId/likes', cardControllers.dislikeCard);

module.exports = cardRouter;

export default cardRouter;
