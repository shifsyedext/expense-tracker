export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarUrl: string | null;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

export interface ForgotPasswordRequest {
  readonly email: string;
}

export interface AuthResponse {
  readonly user: User;
  readonly token: string;
}

export interface ApiErrorResponse {
  readonly message: string;
  readonly code: string;
}