import { FC, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useDispatch();

  const actions = useMemo(
    () => ({
      moveDown: () => dispatch(moveIngredientDown(index)),
      moveUp: () => dispatch(moveIngredientUp(index)),
      remove: () => dispatch(removeIngredient(ingredient.id))
    }),
    [dispatch, index, ingredient.id]
  );

  const handleAction = useCallback(
    (actionType: 'moveDown' | 'moveUp' | 'remove') => {
      actions[actionType]();
    },
    [actions]
  );

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={() => handleAction('moveUp')}
      handleMoveDown={() => handleAction('moveDown')}
      handleClose={() => handleAction('remove')}
    />
  );
};

export default BurgerConstructorElement;
