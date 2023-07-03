import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';
import { IJwt } from '../interfaces/IJwt';
import { unauthorizedError } from '../constants/constants';

export default (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(unauthorizedError)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload: IJwt | null;

  try {
    payload = jwt.verify(token, 'some-secret-key') as IJwt;
  } catch (err) {
    return res
      .status(unauthorizedError)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
