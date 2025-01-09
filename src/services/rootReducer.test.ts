import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../services/store';
import { burgerConstructorInitialState } from './slices/constructorSlice';
import { ingredientInitialState } from './slices/ingredientSlice';
import { feedInitialState } from './slices/feedSlice';
import { userInitialState } from './slices/userSlice';
import { orderInitialState } from './slices/orderSlice';

describe('Тест rootReducer', () => {
  const expectedInitialState = {
    constructorBurger: burgerConstructorInitialState,
    ingredient: ingredientInitialState,
    feed: feedInitialState,
    user: userInitialState,
    order: orderInitialState
  };

  test('Инициализация хранилища', () => {
    const action = { type: 'someAction' };
    const result = rootReducer(undefined, action);
    
    (Object.keys(expectedInitialState) as Array<keyof typeof expectedInitialState>).forEach(key => {
      expect(result[key]).toEqual(expectedInitialState[key]);
    });
  });
});
