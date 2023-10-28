import { AuthContext } from './../context/AuthContext';
import { useContext } from 'react';

export default function Signin() {
  const { user, setUser } = useContext(AuthContext);
  return <></>;
}