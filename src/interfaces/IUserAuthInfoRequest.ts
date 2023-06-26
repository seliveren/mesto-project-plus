import { Request } from 'express';

export interface IUserAuthInfoRequest extends Request {
  user?: {
    _id: string,
  },
}
