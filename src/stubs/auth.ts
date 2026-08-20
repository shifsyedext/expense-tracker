import type {
  RegisterRequest,
  User,
} from '../types/auth';

export interface AuthStubUser extends User {
  password: string;
}

export const authStubUser: AuthStubUser = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  avatarUrl: null,
  password: 'password123',
};

const STORAGE_KEY =
  'expense_tracker_mock_users';

const defaultUsers: AuthStubUser[] = [
  authStubUser,
];

const saveUsers = (
  users: AuthStubUser[],
): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users),
  );
};

const loadUsers = (): AuthStubUser[] => {
  const storedUsers =
    localStorage.getItem(STORAGE_KEY);

  if (storedUsers === null) {
    saveUsers(defaultUsers);
    return defaultUsers;
  }

  try {
    return JSON.parse(
      storedUsers,
    ) as AuthStubUser[];
  } catch {
    saveUsers(defaultUsers);
    return defaultUsers;
  }
};

export const getStubUsers =
  (): AuthStubUser[] => {
    return loadUsers();
  };

export const findStubUserByEmail = (
  email: string,
): AuthStubUser | undefined => {
  return loadUsers().find(
    (user) =>
      user.email.toLowerCase() ===
      email.trim().toLowerCase(),
  );
};

export const findStubUserById = (
  userId: string,
): AuthStubUser | undefined => {
  return loadUsers().find(
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
    firstName:
      request.firstName.trim(),
    lastName:
      request.lastName.trim(),
    avatarUrl: null,
    password: request.password,
  };

  users.push(newUser);

  saveUsers(users);

  return newUser;
};

export const updateStubUser = (
  updatedUser: Partial<AuthStubUser> & {
    id: string;
  },
): AuthStubUser | undefined => {
  const users = loadUsers();

  const index = users.findIndex(
    (user) => user.id === updatedUser.id,
  );

  if (index === -1) {
    return undefined;
  }

  const mergedUser: AuthStubUser = {
    ...users[index],
    ...updatedUser,
  };

  users[index] = mergedUser;

  saveUsers(users);

  return mergedUser;
};

export const deleteStubUser = (
  userId: string,
): boolean => {
  const users = loadUsers();

  const filteredUsers = users.filter(
    (user) => user.id !== userId,
  );

  if (
    filteredUsers.length === users.length
  ) {
    return false;
  }

  saveUsers(filteredUsers);

  return true;
};