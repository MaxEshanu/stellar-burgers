import { FC, memo, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredientToConstructor } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const backgroundState = useMemo(
      () => ({ background: location }),
      [location]
    );

    const addIngredient = useCallback(() => {
      dispatch(addIngredientToConstructor(ingredient));
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={backgroundState}
        handleAdd={addIngredient}
      />
    );
  }
);
