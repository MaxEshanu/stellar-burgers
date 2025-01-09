import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderSlice, { getOrderWithNumber } from './orderSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      order: orderSlice
    }
  });

describe('Тесты экшенов заказа', () => {
  describe('Получение данных заказа', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
      store = createTestStore();
    });

    test('Ожидание', () => {
      store.dispatch({ type: getOrderWithNumber.pending.type });
      const state = store.getState().order;
      expect(state.request).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Ошибка', () => {
      const error = 'test_error';
      store.dispatch({
        type: getOrderWithNumber.rejected.type,
        error: { message: error }
      });
      const state = store.getState().order;
      expect(state.request).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Успешное получение данных заказа', () => {
      const testPayload = {
        orders: [
          {
            _id: '677e83e0133acd001be4909b',
            ingredients: Array(8)
              .fill('643d69a5c3f7b9001cfa0940')
              .concat(['643d69a5c3f7b9001cfa093d']),
            owner: {
              name: 'Максим',
              email: 'eshanu01@mail.ru',
              createdAt: '2025-01-08T15:38:37.481Z',
              updatedAt: '2025-01-08T15:38:37.481Z'
            },
            status: 'done',
            name: 'Флюоресцентный метеоритный бургер',
            createdAt: '2025-01-08T15:38:37.481Z',
            updatedAt: '2025-01-08T15:38:37.481Z',
            number: 65053
          }
        ]
      };

      store.dispatch({
        type: getOrderWithNumber.fulfilled.type,
        payload: testPayload
      });

      const state = store.getState().order;
      expect(state.request).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.orderByNumber).toEqual(testPayload.orders[0]);
    });
  });
});
