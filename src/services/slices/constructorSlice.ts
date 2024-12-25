import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TBurgerConsturctorState = {
  loading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  order: boolean;
  orderModal: TOrder | null;
  error: string | null;
};

const initialState: TBurgerConsturctorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  order: false,
  orderModal: null,
  error: null
};

export const makeOrder = createAsyncThunk(
  'user/order',
  async (data: string[]) => orderBurgerApi(data)
);

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  selectors: {
    getBurgerConstructorState: (state) => state
  },
  reducers: {
    addIngredientToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload,
        0,
        state.constructorItems.ingredients.splice(action.payload - 1, 1)[0]
      );
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload,
        0,
        state.constructorItems.ingredients.splice(action.payload + 1, 1)[0]
      );
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    resetModal: (state) => {
      state.orderModal = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state, action) => {
        state.loading = true;
        state.order = true;
        state.error = null;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.loading = false;
        state.order = false;
        state.error = action.error.message as string;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = false;
        state.error = null;
        state.orderModal = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
        console.log(action.payload);
      });
  }
});

export const {
  addIngredientToConstructor,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setOrder,
  resetModal
} = constructorSlice.actions;

export const { getBurgerConstructorState } = constructorSlice.selectors;
export default constructorSlice.reducer;
