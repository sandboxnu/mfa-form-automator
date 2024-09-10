import { useContext } from 'react';
import { AuthContext } from '@web/context/AuthContext';

/**
 * @returns Authentication context, state, and methods by consuming the AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
