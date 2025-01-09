import { FC, useCallback, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getBurgerConstructorState,
  makeOrder,
  setOrder,
  resetModal
} from '../../services/slices/constructorSlice';
import { getUserState } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { constructorItems, orderModal, order } = useSelector(
    getBurgerConstructorState
  );
  const { isAuthenticated } = useSelector(getUserState);

  const ingredientIds = useMemo(() => {
    const ids = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    if (constructorItems.bun) {
      const bunId = constructorItems.bun._id;
      return [bunId, ...ids, bunId];
    }
    return ids;
  }, [constructorItems]);

  const handleOrderClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun) return;

    dispatch(setOrder(true));
    dispatch(makeOrder(ingredientIds));
  }, [
    isAuthenticated,
    constructorItems.bun,
    dispatch,
    navigate,
    ingredientIds
  ]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(setOrder(false));
    dispatch(resetModal());
  }, [dispatch]);

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={order}
      constructorItems={constructorItems}
      orderModalData={orderModal}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
