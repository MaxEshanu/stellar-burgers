import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userSlice, {
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  getUser,
  getAllOrders
} from './userSlice';
import { TOrder } from '@utils-types';
import { TUserState } from './userSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userSlice
    }
  });

let store: ReturnType<typeof createTestStore>;

beforeEach(() => {
  store = createTestStore();
});

const checkPendingState = (state: TUserState) => {
  expect(state.loading).toBeTruthy();
  expect(state.error).toBeNull();
};

const checkRejectedState = (state: TUserState, error: string) => {
  expect(state.loading).toBeFalsy();
  expect(state.error).toBe(error);
};

const testUserAction = (
  action: any,
  successPayload: any,
  additionalChecks?: (state: TUserState) => void
) => {
  test('Ожидание', () => {
    store.dispatch({ type: action.pending.type });
    checkPendingState(store.getState().user);
  });

  test('Ошибка', () => {
    const error = 'test_error';
    store.dispatch({ type: action.rejected.type, error: { message: error } });
    checkRejectedState(store.getState().user, error);
  });

  test('Успешно', () => {
    store.dispatch({ type: action.fulfilled.type, payload: successPayload });
    const state = store.getState().user;
    expect(state.loading).toBeFalsy();
    expect(state.error).toBeNull();
    if (additionalChecks) additionalChecks(state);
  });
};

describe('Тесты экшенов пользователя', () => {
  const testUserData = {
    email: 'eshanu01@mail.ru',
    name: 'Максим'
  };

  describe('Логин', () => {
    testUserAction(
      loginUser,
      { accessToken: '123', refreshToken: '456', user: testUserData },
      (state) => {
        expect(state.userData).toEqual(testUserData);
        expect(state.isAuthenticated).toBeTruthy();
      }
    );
  });

  describe('Регистрация', () => {
    testUserAction(
      registerUser,
      { accessToken: '123', refreshToken: '456', user: testUserData },
      (state) => {
        expect(state.userData).toEqual(testUserData);
        expect(state.isAuthenticated).toBeTruthy();
      }
    );
  });

  describe('Выход из аккаунта', () => {
    testUserAction(logoutUser, { message: 'test_logout' }, (state) => {
      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBeFalsy();
    });
  });

  describe('Изменение данных пользователя', () => {
    testUserAction(updateUser, { user: testUserData }, (state) => {
      expect(state.response).toEqual(testUserData);
    });
  });

  describe('Запрос пользователя', () => {
    testUserAction(getUser, { user: testUserData }, (state) => {
      expect(state.userData).toEqual(testUserData);
      expect(state.isAuthenticated).toBeTruthy();
    });
  });

  describe('Запрос заказов пользователя', () => {
    const testOrders: TOrder[] = [
      {
        _id: '677e83e0133acd001be4909b',
        status: 'done',
        name: 'Флюоресцентный метеоритный бургер',
        createdAt: '2025-01-08T15:38:37.481Z',
        updatedAt: '2025-01-08T15:38:37.481Z',
        number: 65053,
        ingredients: ['ingredient1', 'ingredient2']
      },
      {
        _id: '677e83e0133acd001be4909v',
        status: 'pending',
        name: 'Флюоресцентный метеоритный бургер',
        createdAt: '2025-01-08T15:38:37.481Z',
        updatedAt: '2025-01-08T15:38:37.481Z',
        number: 65054,
        ingredients: ['ingredient3', 'ingredient4']
      }
    ];

    testUserAction(getAllOrders, testOrders, (state) => {
      expect(state.userOrders).toEqual(testOrders);
    });
  });
});
