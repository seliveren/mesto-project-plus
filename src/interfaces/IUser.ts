import mongoose from 'mongoose';

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

export interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => // eslint-disable-line no-unused-vars
    Promise<mongoose.Document<unknown, any, IUser>>
}
