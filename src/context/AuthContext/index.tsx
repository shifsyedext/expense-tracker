import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../types/auth';

import {
  deleteProfile as deleteProfileUser,
  forgotPassword as forgotPasswordUser,
  getProfile as getProfileUser,
  login as loginUser,
  register as registerUser,
  updateProfile as updateProfileUser,
} from '../../api/authService';

interface AuthContextValue {
  readonly user: User | null;
  readonly token: string | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;

  readonly login: (
    request: LoginRequest,
  ) => Promise<AuthResponse>;

  readonly register: (
    request: RegisterRequest,
  ) => Promise<AuthResponse>;

  readonly updateUser: (
    user: User,
  ) => Promise<void>;

  readonly refreshUser: () => Promise<void>;

  readonly deleteUser: () => Promise<void>;

  readonly forgotPassword: (
    request: ForgotPasswordRequest,
  ) => Promise<void>;

  readonly logout: () => void;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

const USER_STORAGE_KEY = 'expense_tracker_user';
const TOKEN_STORAGE_KEY = 'expense_tracker_token';

const getStoredUser = (): User | null => {
  const storedUser =
    sessionStorage.getItem(USER_STORAGE_KEY);

  if (storedUser === null) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const getStoredToken = (): string | null => {
  return sessionStorage.getItem(
    TOKEN_STORAGE_KEY,
  );
};

export const AuthProvider = ({
  children,
}: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(
    getStoredUser,
  );

  const [token, setToken] = useState<string | null>(
    getStoredToken,
  );

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const login = async (
    request: LoginRequest,
  ): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const response = await loginUser(request);

      setUser(response.user);
      setToken(response.token);

      sessionStorage.setItem(
        TOKEN_STORAGE_KEY,
        response.token,
      );

      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(response.user),
      );

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    request: RegisterRequest,
  ): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const response =
        await registerUser(request);

      setUser(response.user);
      setToken(response.token);

      sessionStorage.setItem(
        TOKEN_STORAGE_KEY,
        response.token,
      );

      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(response.user),
      );

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    updatedUser: User,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const savedUser =
        await updateProfileUser(updatedUser);

      setUser(savedUser);

      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(savedUser),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (user === null) {
      return;
    }

    setIsLoading(true);

    try {
      const refreshedUser =
        await getProfileUser(user.id);

      setUser(refreshedUser);

      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(refreshedUser),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (): Promise<void> => {
    if (user === null) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteProfileUser(user.id);

      setUser(null);
      setToken(null);

      sessionStorage.removeItem(
        TOKEN_STORAGE_KEY,
      );

      sessionStorage.removeItem(
        USER_STORAGE_KEY,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (
    request: ForgotPasswordRequest,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await forgotPasswordUser(request);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem(
      TOKEN_STORAGE_KEY,
    );

    sessionStorage.removeItem(
      USER_STORAGE_KEY,
    );
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated:
        user !== null && token !== null,
      isLoading,
      login,
      register,
      updateUser,
      refreshUser,
      deleteUser,
      forgotPassword,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      forgotPassword,
      updateUser,
      refreshUser,
      deleteUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider.',
    );
  }

  return context;
};