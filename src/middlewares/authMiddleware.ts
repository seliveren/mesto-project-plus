import { NextFunction, Response } from 'express';
import { IUserAuthInfoRequest } from '../interfaces/IUserAuthInfoRequest';

const authMiddleware = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6498139263f2880b638490e1',
  };
  next();
};

export default authMiddleware;
