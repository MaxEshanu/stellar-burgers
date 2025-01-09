import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice, { getIngredients } from './ingredientSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsSlice
    }
  });

describe('Тесты экшенов ингредиентов', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Получение ингредиентов', () => {
    test('Ожидание', () => {
      store.dispatch({ type: getIngredients.pending.type });
      const state = store.getState().ingredients;
      expect(state.loading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Ошибка', () => {
      const error = 'test_error';
      store.dispatch({
        type: getIngredients.rejected.type,
        error: { message: error }
      });
      const state = store.getState().ingredients;
      expect(state.loading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Успешное получение ингредиентов', () => {
      const testPayload = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };
      store.dispatch({
        type: getIngredients.fulfilled.type,
        payload: testPayload
      });
      const state = store.getState().ingredients;
      expect(state.loading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(testPayload);
    });
  });
});
