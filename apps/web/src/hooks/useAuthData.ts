import { User } from "./../utils/types";
import { AuthContext } from "./../context/AuthContext";
import { useContext } from "react";

export const useAuthData = () => {
  const {user, login, logout} = useContext(AuthContext);

  return {user, login, logout};
}