import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedSlice, { getFeedsFromApi } from './feedSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      feed: feedSlice
    }
  });

describe('Тесты экшенов ленты', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Получение ленты', () => {
    test('Ожидание', () => {
      store.dispatch({ type: getFeedsFromApi.pending.type });
      const state = store.getState().feed;
      expect(state.loading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Ошибка', () => {
      const error = 'test_error';
      store.dispatch({
        type: getFeedsFromApi.rejected.type,
        error: { message: error }
      });
      const state = store.getState().feed;
      expect(state.loading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Успешное получение ленты', () => {
      const testPayload = {
        orders: {
          _id: '677e83e0133acd001be4909b',
          ingredients: [
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный метеоритный бургер',
          createdAt: '2025-01-08T15:38:37.481Z',
          updatedAt: '2025-01-08T15:38:37.481Z',
          number: 65053
        },
        total: 64679,
        totalToday: 55
      };
      store.dispatch({
        type: getFeedsFromApi.fulfilled.type,
        payload: testPayload
      });
      const state = store.getState().feed;
      expect(state.loading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(testPayload.orders);
      expect(state.total).toBe(testPayload.total);
      expect(state.totalToday).toBe(testPayload.totalToday);
    });
  });
});
