import { useContext } from 'react';
import { AuthContext } from '@web/context/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
