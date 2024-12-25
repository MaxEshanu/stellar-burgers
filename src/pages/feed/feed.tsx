import { FC, useEffect, useCallback } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedState, getFeedsFromApi } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const { orders, loading } = useSelector(getFeedState);
  const dispatch = useDispatch();

  const fetchFeeds = useCallback(() => {
    dispatch(getFeedsFromApi());
  }, [dispatch]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={fetchFeeds} />;
};
