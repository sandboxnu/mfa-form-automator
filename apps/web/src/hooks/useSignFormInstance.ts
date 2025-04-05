import { useContext } from 'react';
import { SignFormInstanceContext } from '../context/SignFormInstanceContext';

export const useSignFormInstance = () => useContext(SignFormInstanceContext);
