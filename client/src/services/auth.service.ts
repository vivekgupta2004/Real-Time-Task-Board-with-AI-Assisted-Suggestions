import api from '@/lib/api';
import { LoginFormData, SignupFormData } from '@/utils/auth.validation';
import { AuthResponse } from '@/types/auth';

export const loginApi = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const signupApi = async (data: SignupFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', data);
  return response.data;
};
