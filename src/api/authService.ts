import axiosInstance from './axiosInstance';

import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

interface StoredUser extends User {
  password: string;
}

const createToken = (
  userId: string,
): string => {
  return `mock-token-${userId}-${Date.now()}`;
};

export const login = async (
  request: LoginRequest,
): Promise<AuthResponse> => {
  const response =
    await axiosInstance.get<StoredUser[]>(
      `/users?email=${request.email}`,
    );

  const user = response.data.find(
    (item) =>
      item.password === request.password,
  );

  if (user === undefined) {
    throw new Error(
      'Invalid email or password.',
    );
  }

  const { password, ...safeUser } =
    user;

  return {
    user: safeUser,
    token: createToken(user.id),
  };
};

export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  const existingUsers =
    await axiosInstance.get<StoredUser[]>(
      `/users?email=${request.email}`,
    );

  if (
    existingUsers.data.length > 0
  ) {
    throw new Error(
      'An account with this email already exists.',
    );
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: request.email,
    firstName: request.firstName,
    lastName: request.lastName,
    avatarUrl: null,
    password: request.password,
  };

  const response =
    await axiosInstance.post<StoredUser>(
      '/users',
      newUser,
    );

  const {
    password,
    ...safeUser
  } = response.data;

  return {
    user: safeUser,
    token: createToken(
      response.data.id,
    ),
  };
};

export const getProfile = async (
  userId: string,
): Promise<User> => {
  const response =
    await axiosInstance.get<StoredUser>(
      `/users/${userId}`,
    );

  const {
    password,
    ...safeUser
  } = response.data;

  return safeUser;
};

export const updateProfile = async (
  user: User,
): Promise<User> => {
  const existingUser =
    await axiosInstance.get<StoredUser>(
      `/users/${user.id}`,
    );

  const updatedUser: StoredUser = {
    ...existingUser.data,
    ...user,
  };

  const response =
    await axiosInstance.put<StoredUser>(
      `/users/${user.id}`,
      updatedUser,
    );

  const {
    password,
    ...safeUser
  } = response.data;

  return safeUser;
};

export const deleteProfile = async (
  userId: string,
): Promise<void> => {
  await axiosInstance.delete(
    `/users/${userId}`,
  );
};

export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  const response =
    await axiosInstance.get<StoredUser[]>(
      `/users?email=${request.email}`,
    );

  const user = response.data[0];

  if (user === undefined) {
    throw new Error(
      'No account found with this email.',
    );
  }

  await axiosInstance.patch(
    `/users/${user.id}`,
    {
      password: request.newPassword,
    },
  );
};