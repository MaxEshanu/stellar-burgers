import { getOrderByNumberApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderByNumber: TOrder | null;
  request: boolean;
  responseOrder: null;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  orderByNumber: null,
  request: false,
  responseOrder: null,
  error: null
};

export const getOrderWithNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderWithNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrderWithNumber.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.request = false;
      })
      .addCase(getOrderWithNumber.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        state.orderByNumber = action.payload.orders[0];
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
