export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
    token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
