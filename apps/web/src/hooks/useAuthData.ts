import { User } from "./../utils/types";
import { AuthContext } from "./../context/AuthContext";
import { useContext } from "react";
import { useRouter } from 'next/router';

export const useAuthData = () => {
  const {user, login, logout} = useContext(AuthContext);
  const router = useRouter();

  const authLogin = (user: User) => {
    login(user);
  }

  const authLogout = () => {
    logout();
    router.push('/signin');
  }

  return {user, login: authLogin, logout: authLogout};
}