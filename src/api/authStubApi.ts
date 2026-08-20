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
  findStubUserByEmail,
  findStubUserById,
  updateStubUser,
} from '../stubs/auth';

const createToken = (
  userId: string,
): string => {
  return `stub-auth-token-${userId}`;
};

const removePassword = (
  user: User & {
    password: string;
  },
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
  const existingUser =
    findStubUserByEmail(request.email);

  if (existingUser) {
    throw new Error(
      'An account with this email already exists.',
    );
  }

  const user =
    createStubUser(request);

  return {
    user: removePassword(user),
    token: createToken(user.id),
  };
};

export const getProfileStub = async (
  userId: string,
): Promise<User> => {
  const user =
    findStubUserById(userId);

  if (!user) {
    throw new Error(
      'Unable to load profile.',
    );
  }

  return removePassword(user);
};

export const updateProfileStub = async (
  user: User,
): Promise<User> => {
  const updatedUser =
    updateStubUser(user);

  if (!updatedUser) {
    throw new Error(
      'Unable to update profile.',
    );
  }

  return removePassword(updatedUser);
};

export const deleteProfileStub = async (
  userId: string,
): Promise<void> => {
  const deleted =
    deleteStubUser(userId);

  if (!deleted) {
    throw new Error(
      'Unable to delete profile.',
    );
  }
};

export const forgotPasswordStub =
  async (
    request: ForgotPasswordRequest,
  ): Promise<void> => {
    const user =
      findStubUserByEmail(
        request.email.trim(),
      );

    if (!user) {
      throw new Error(
        'No account found with this email.',
      );
    }

    if (
      request.newPassword.length < 8
    ) {
      throw new Error(
        'Password must be at least 8 characters.',
      );
    }

    if (
      request.newPassword !==
      request.confirmPassword
    ) {
      throw new Error(
        'Passwords do not match.',
      );
    }

    updateStubUser({
      id: user.id,
      password:
        request.newPassword,
    });
  };