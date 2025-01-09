import { getFeedsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeedsFromApi = createAsyncThunk('feeds/all', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsFromApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedsFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getFeedsFromApi.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export { initialState as feedInitialState };
export const { getFeedState } = feedSlice.selectors;
export default feedSlice.reducer;
