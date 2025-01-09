import { expect, test, describe, beforeEach } from '@jest/globals';
import { nanoid } from '@reduxjs/toolkit';
import constructorSlice, {
  addIngredientToConstructor,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  burgerConstructorInitialState,
  TBurgerConsturctorState
} from './constructorSlice';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'TestID')
}));

describe('Конструктор бургера: проверка редьюсеров', () => {
  let initialTestState: TBurgerConsturctorState;

  beforeEach(() => {
    initialTestState = JSON.parse(
      JSON.stringify(burgerConstructorInitialState)
    );
    initialTestState.constructorItems = {
      bun: {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Булка R2-D3 флюоресцентная',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        id: 'testBunID'
      },
      ingredients: [
        {
          _id: '643d69a5c3f7b9001cfa0943',
          name: 'Соус Space Sauce фирменный',
          type: 'sauce',
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-04-large.png',
          id: 'testSauceID'
        },
        {
          _id: '643d69a5c3f7b9001cfa0940',
          name: 'Метеорит говяжий (отбивная)',
          type: 'main',
          proteins: 800,
          fat: 800,
          carbohydrates: 300,
          calories: 2674,
          price: 3000,
          image: 'https://code.s3.yandex.net/react/code/meat-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-04-large.png',
          id: 'testFillingID'
        }
      ]
    };
  });

  test('Добавление нового ингредиента в конструктор', () => {
    const newIngredient = {
      _id: '643d69a5c3f7b9001cfa094a',
      name: 'Сыр астероидный с плесенью',
      type: 'main',
      proteins: 84,
      fat: 48,
      carbohydrates: 420,
      calories: 3377,
      price: 4142,
      image: 'https://code.s3.yandex.net/react/code/cheese.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png'
    };

    const resultState = constructorSlice(
      initialTestState,
      addIngredientToConstructor(newIngredient)
    );

    expect(nanoid).toHaveBeenCalled();
    expect(resultState.constructorItems.ingredients).toHaveLength(
      initialTestState.constructorItems.ingredients.length + 1
    );
    expect(
      resultState.constructorItems.ingredients[
        resultState.constructorItems.ingredients.length - 1
      ]
    ).toEqual({
      ...newIngredient,
      id: 'TestID'
    });
  });

  test('Удаление ингредиента из конструктора', () => {
    const ingredientIdToRemove = 'testSauceID';

    const resultState = constructorSlice(
      initialTestState,
      removeIngredient(ingredientIdToRemove)
    );

    expect(resultState.constructorItems.ingredients).toHaveLength(
      initialTestState.constructorItems.ingredients.length - 1
    );
    expect(
      resultState.constructorItems.ingredients.find(
        (ingredient) => ingredient.id === ingredientIdToRemove
      )
    ).toBeUndefined();
  });

  describe('Изменение порядка ингредиентов в конструкторе', () => {
    test('Перемещение ингредиента вверх по списку', () => {
      const ingredientIndex = 1;

      const resultState = constructorSlice(
        initialTestState,
        moveIngredientUp(ingredientIndex)
      );

      expect(
        resultState.constructorItems.ingredients[ingredientIndex - 1]
      ).toEqual(initialTestState.constructorItems.ingredients[ingredientIndex]);
      expect(resultState.constructorItems.ingredients[ingredientIndex]).toEqual(
        initialTestState.constructorItems.ingredients[ingredientIndex - 1]
      );
    });

    test('Перемещение ингредиента вниз по списку', () => {
      const ingredientIndex = 0;

      const resultState = constructorSlice(
        initialTestState,
        moveIngredientDown(ingredientIndex)
      );

      expect(resultState.constructorItems.ingredients[ingredientIndex]).toEqual(
        initialTestState.constructorItems.ingredients[ingredientIndex + 1]
      );
      expect(
        resultState.constructorItems.ingredients[ingredientIndex + 1]
      ).toEqual(initialTestState.constructorItems.ingredients[ingredientIndex]);
    });
  });
});
