import { URLtest as URL } from '@api';

const INGREDIENTS = {
  Nbun: '643d69a5c3f7b9001cfa093c',
  filling: '643d69a5c3f7b9001cfa0940',
  R2D3bun: '643d69a5c3f7b9001cfa093d'
};

type IngredientType = keyof typeof INGREDIENTS;

const getIngredient = (type: IngredientType): string => `[data-cy=${INGREDIENTS[type]}]`;

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', `${URL}/ingredients`, { fixture: 'ingredients.json' });
    cy.intercept('POST', `${URL}/auth/login`, { fixture: 'user.json' });
    cy.intercept('GET', `${URL}/auth/user`, { fixture: 'user.json' });
    cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' });
    cy.visit('/');
    cy.get('#modals').as('modalWindow');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Проверка счетчика ингредиентов', () => {
      cy.get(getIngredient('filling')).find('button').click();
      cy.get(getIngredient('filling')).find('.counter__num').should('contain', '1');
    });

    it('Добавление булок и начинки в конструктор', () => {
      cy.get(getIngredient('Nbun')).find('button').click();
      cy.get(getIngredient('filling')).find('button').click();
    });

    it('Замена одной булки на другую', () => {
      cy.get(getIngredient('Nbun')).find('button').click();
      cy.get(getIngredient('R2D3bun')).find('button').click();
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setLocalStorage('refreshToken', '123');
      cy.setCookie('accessToken', '456');
    });

    afterEach(() => {
      cy.clearLocalStorageAndCookies();
    });

    it('Отправка заказа и получение ответа', () => {
      cy.get(getIngredient('Nbun')).find('button').click();
      cy.get(getIngredient('filling')).find('button').click();
      cy.get('[data-cy="makeOrder"]').click();
      cy.get('@modalWindow').find('h2').should('contain', '65029');
    });
  });

  describe('Тестирование модальных окон', () => {
    const openModal = () => {
      cy.get('@modalWindow').should('be.empty');
      cy.get(getIngredient('filling')).find('a').click();
      cy.get('@modalWindow').should('not.be.empty');
    };

    it('Открытие и проверка содержимого', () => {
      openModal();
      cy.url().should('include', INGREDIENTS.filling);
    });

    it('Закрытие при нажатии на кнопку', () => {
      openModal();
      cy.get('@modalWindow').find('button').click();
      cy.get('@modalWindow').should('be.empty');
    });

    it('Закрытие при клике вне окна', () => {
      openModal();
      cy.get('[data-cy="modal"]').click({ force: true });
      cy.get('@modalWindow').should('be.empty');
    });

    it('Закрытие при нажатии клавиши Escape', () => {
      openModal();
      cy.get('body').type('{esc}');
      cy.get('@modalWindow').should('be.empty');
    });
  });
});