import { useContext } from 'react';
import { AuthContext } from '@web/context/AuthContext';

/**
 * @returns the authentication context wrapped in useContext
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
