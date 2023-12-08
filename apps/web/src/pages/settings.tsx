import { useQuery } from '@tanstack/react-query';
import { useAuth } from './../hooks/useAuth';
import { DefaultService } from '@web/client';

export default function Settings() {
  // Placeholder to test logout functionality:
  const { user, logout } = useAuth();

  const { error, isLoading } = useQuery({
    queryKey: ['api', 'logout'],
    queryFn: DefaultService.appControllerLogout,
    enabled: user === null,
  });

  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
}
