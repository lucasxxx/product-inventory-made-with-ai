export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
} 