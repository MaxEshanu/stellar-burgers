import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '../../src/components/ui/preloader/preloader';
import { getUserState } from '../services/slices/userSlice';

type ProtectedRouteProps = {
  withoutAuth?: boolean;
};

export const ProtectedRoute = ({ withoutAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, isAuthenticated } = useSelector(getUserState);

  const handleUnauthenticated = () => (
    <Navigate replace to='/login' state={{ from: location }} />
  );

  const handleAuthenticated = () => {
    const defaultPath = { pathname: '/' };
    const from = location.state?.from || defaultPath;
    return <Navigate replace to={from} />;
  };

  if (!withoutAuth && !isAuthenticated) {
    return handleUnauthenticated();
  }

  if (withoutAuth && isAuthenticated) {
    return handleAuthenticated();
  }

  if (isAuthChecked) {
    return <Preloader />;
  }

  return <Outlet />;
};
