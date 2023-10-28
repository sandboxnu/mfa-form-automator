import { createContext } from 'react';
import { User } from './../utils/types';

interface AuthContextData {
  user: User | null;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  setUser: () => {},
});