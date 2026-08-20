import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

import {
  createStubUser,
  deleteStubUser,
  findStubUserById,
  findStubUserByEmail,
  updateStubUser,
} from '../stubs/auth';

const createToken = (
  userId: string,
): string => {
  return `stub-auth-token-${userId}`;
};

const removePassword = (
  user: {
    readonly password: string;
  } & User,
): User => {
  const {
    password: _password,
    ...safeUser
  } = user;

  return safeUser;
};

export const loginStub = async (
  request: LoginRequest,
): Promise<AuthResponse> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const user = findStubUserByEmail(
    request.email,
  );

  if (
    user === undefined ||
    user.password !== request.password
  ) {
    throw new Error(
      'Invalid email or password.',
    );
  }

  return {
    user: removePassword(user),
    token: createToken(user.id),
  };
};

export const registerStub = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const existingUser =
    findStubUserByEmail(request.email);

  if (existingUser !== undefined) {
    throw new Error(
      'An account with this email already exists.',
    );
  }

  const user = createStubUser(request);

  return {
    user: removePassword(user),
    token: createToken(user.id),
  };
};

export const getProfileStub = async (
  userId: string,
): Promise<User> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const user = findStubUserById(userId);

  if (user === undefined) {
    throw new Error(
      'Unable to load profile.',
    );
  }

  return removePassword(user);
};

export const updateProfileStub = async (
  user: User,
): Promise<User> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const updatedUser = updateStubUser(user);

  if (updatedUser === undefined) {
    throw new Error(
      'Unable to update profile.',
    );
  }

  return removePassword(updatedUser);
};

export const deleteProfileStub = async (
  userId: string,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  const deleted = deleteStubUser(userId);

  if (!deleted) {
    throw new Error(
      'Unable to delete profile.',
    );
  }
};

export const forgotPasswordStub = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 500);
  });

  if (!request.email.trim()) {
    throw new Error(
      'Email is required.',
    );
  }
};