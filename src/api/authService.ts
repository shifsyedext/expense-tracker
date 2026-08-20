import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

import {
  deleteProfileStub,
  forgotPasswordStub,
  getProfileStub,
  loginStub,
  registerStub,
  updateProfileStub,
} from './authStubApi';

import axiosInstance from './axiosInstance';

export const login = async (
  request: LoginRequest,
): Promise<AuthResponse> => {
  void axiosInstance;
  return loginStub(request);
};

export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  return registerStub(request);
};

export const getProfile = async (
  userId: string,
): Promise<User> => {
  return getProfileStub(userId);
};

export const updateProfile = async (
  user: User,
): Promise<User> => {
  return updateProfileStub(user);
};

export const deleteProfile = async (
  userId: string,
): Promise<void> => {
  return deleteProfileStub(userId);
};

export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  return forgotPasswordStub(request);
};