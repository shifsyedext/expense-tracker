import type {
  RegisterRequest,
  User,
} from '../types/auth';

export interface AuthStubUser extends User {
  readonly password: string;
}

export const authStubUser: AuthStubUser = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  avatarUrl: null,
  password: 'password123',
};

const STORAGE_KEY = 'expense_tracker_mock_users';

const defaultUsers: AuthStubUser[] = [
  authStubUser,
];

const loadUsers = (): AuthStubUser[] => {
  const storedUsers =
    localStorage.getItem(STORAGE_KEY);

  if (storedUsers === null) {
    saveUsers(defaultUsers);
    return defaultUsers;
  }

  try {
    const users =
      JSON.parse(storedUsers) as AuthStubUser[];

    const hasDemoUser = users.some(
      (user) =>
        user.id === authStubUser.id,
    );

    if (!hasDemoUser) {
      const updatedUsers = [
        authStubUser,
        ...users,
      ];

      saveUsers(updatedUsers);

      return updatedUsers;
    }

    return users;
  } catch {
    saveUsers(defaultUsers);

    return defaultUsers;
  }
};

const saveUsers = (
  users: AuthStubUser[],
): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users),
  );
};

export const getStubUsers = (): AuthStubUser[] => {
  return loadUsers();
};

export const findStubUserByEmail = (
  email: string,
): AuthStubUser | undefined => {
  const users = loadUsers();

  return users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.trim().toLowerCase(),
  );
};

export const findStubUserById = (
  userId: string,
): AuthStubUser | undefined => {
  const users = loadUsers();

  return users.find(
    (user) => user.id === userId,
  );
};

export const createStubUser = (
  request: RegisterRequest,
): AuthStubUser => {
  const users = loadUsers();

  const newUser: AuthStubUser = {
    id: `user-${Date.now()}`,
    email: request.email.trim(),
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    avatarUrl: null,
    password: request.password,
  };

  saveUsers([
    ...users,
    newUser,
  ]);

  return newUser;
};

export const updateStubUser = (
  updatedUser: User,
): AuthStubUser | undefined => {
  const users = loadUsers();

  const existingUser = users.find(
    (user) => user.id === updatedUser.id,
  );

  if (existingUser === undefined) {
    return undefined;
  }

  const updatedStubUser: AuthStubUser = {
    ...existingUser,
    ...updatedUser,
  };

  const updatedUsers = users.map(
    (user) =>
      user.id === updatedUser.id
        ? updatedStubUser
        : user,
  );

  saveUsers(updatedUsers);

  return updatedStubUser;
};

export const deleteStubUser = (
  userId: string,
): boolean => {
  const users = loadUsers();

  const userExists = users.some(
    (user) => user.id === userId,
  );

  if (!userExists) {
    return false;
  }

  const remainingUsers = users.filter(
    (user) => user.id !== userId,
  );

  saveUsers(remainingUsers);

  return true;
};