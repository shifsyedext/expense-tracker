import axiosInstance from './axiosInstance';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from '../types/auth';

export const loginUser = async (
  request: LoginRequest,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/login',
    request,
  );

  return response.data;
};

export const registerUser = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/register',
    request,
  );

  return response.data;
};

export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  await axiosInstance.post<void>(
    '/auth/forgot-password',
    request,
  );
};