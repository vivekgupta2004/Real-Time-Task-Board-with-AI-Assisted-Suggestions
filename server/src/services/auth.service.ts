import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';
import { AppError } from '../utils/appError';
import { SignupInput, LoginInput } from '../utils/auth.validation';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: Partial<IUser>;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

const sanitizeUser = (user: IUser): Partial<IUser> => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.tokenVersion;
  return userObject;
};

export const registerUser = async (data: SignupInput): Promise<AuthResult> => {
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

  const userId = user._id.toString();
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, user.tokenVersion || 0);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

export const loginUser = async (data: LoginInput): Promise<AuthResult> => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password +refreshToken +tokenVersion');
  if (!user || !user.password) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const userId = user._id.toString();
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, user.tokenVersion || 0);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

export const refreshTokens = async (tokenString: string): Promise<RefreshResult> => {
  let decoded;
  try {
    decoded = verifyRefreshToken(tokenString);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.userId).select('+refreshToken +tokenVersion');
  if (!user || !user.refreshToken) {
    throw new AppError('Invalid refresh token or user logged out', 401);
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new AppError('Refresh token has been revoked', 401);
  }

  const isTokenMatch = await bcrypt.compare(tokenString, user.refreshToken);
  if (!isTokenMatch) {
    throw new AppError('Invalid refresh token', 401);
  }

  const userId = user._id.toString();
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, user.tokenVersion || 0);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

export const logoutAllDevices = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $inc: { tokenVersion: 1 },
    $unset: { refreshToken: 1 },
  });
};
