import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getAllOrders, getUserState } from '../../services/slices/userSlice';
import { getFeedsFromApi } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { userOrders, loading } = useSelector(getUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getFeedsFromApi());
  }, []);

  if (loading === true) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
