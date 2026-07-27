import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';
import { AppError } from '../utils/appError';
import { SignupInput, LoginInput } from '../utils/auth.validation';

export const registerUser = async (data: SignupInput): Promise<Partial<IUser>> => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

export const loginUser = async (data: LoginInput): Promise<Partial<IUser>> => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};
