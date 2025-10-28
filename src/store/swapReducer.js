import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '@config';
import { encrypt } from '@utils/crypto';

const { useAPIEncryption } = config;

// Utility for encrypted API requests
const apiRequest = async ({ endpoint, method, body }) => {
  let payload = body;
  if (useAPIEncryption && method === 'POST') {
    payload = encrypt(body, endpoint);
  }
  const { data } = await axios({
    // baseURL: process.env.REACT_APP_APIURL,
    baseURL:` http://localhost:8000/`,
    url: endpoint,
    method: method.toLowerCase(),
    ...(body && method === 'POST' && { data: payload }),
    ...(body && method === 'GET' && { params: payload }),
  });

  if (data.status === 200 && !data.success) throw new Error(data.result);
  return data.result;
};

// Async thunks replacing Flux actions
export const getInfo = createAsyncThunk('swap/getInfo', async () =>
   
  await apiRequest({ endpoint: '/api/v1/getInfo', method: 'GET' })
);
export const getBalance = createAsyncThunk('swap/getBalance', async () =>
  await apiRequest({ endpoint: '/api/v1/getBalance', method: 'GET' })
);
export const getUnconfirmedBeldexTxs = createAsyncThunk('swap/getUnconfirmedBeldexTxs', async (body) =>
  await apiRequest({ endpoint: '/api/v1/getUncomfirmedBeldexTransactions', method: 'GET', body })
);
export const getSwaps = createAsyncThunk('swap/getSwaps', async (body) =>
  await apiRequest({ endpoint: '/api/v1/getSwaps', method: 'GET', body })
);
export const swapToken = createAsyncThunk('swap/swapToken', async (body) =>
  await apiRequest({ endpoint: '/api/v1/swap', method: 'POST', body })
);
export const finalizeSwapToken = createAsyncThunk('swap/finalizeSwapToken', async (body) =>
  await apiRequest({ endpoint: '/api/v1/finalizeSwap', method: 'POST', body })
);
export const sendTransactionHash = createAsyncThunk('swap/sendTransactionHash', async (body) =>
  await apiRequest({ endpoint: '/api/v1/transfer', method: 'POST', body })
);
export const sendTransactionErrorLog = createAsyncThunk('swap/sendTransactionErrorLog', async (body) =>
  await apiRequest({ endpoint: '/api/v1/log', method: 'POST', body })
);

// Redux slice with async reducers
const initialState = {
  info: null,
  balance: [],
  unconfirmedBeldexTxs: [],
  swaps: [],
  swapResult: null,
  finalizeSwapTokenResult: null,
  transactionInfo: null,
  transactionErrorLog: null,
  error: null,
  loading: false,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle async thunks
    builder
      // Info
      .addCase(getInfo.pending, (state) => { state.loading = true; })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(getInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Balance
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      // Unconfirmed Beldex TXs
      .addCase(getUnconfirmedBeldexTxs.fulfilled, (state, action) => {
        state.unconfirmedBeldexTxs = action.payload;
      })
      // Swaps
      .addCase(getSwaps.fulfilled, (state, action) => {
        state.swaps = action.payload;
      })
      // Swap Token
      .addCase(swapToken.fulfilled, (state, action) => {
        state.swapResult = action.payload;
      })
      // Finalize Swap
      .addCase(finalizeSwapToken.fulfilled, (state, action) => {
        state.finalizeSwapTokenResult = action.payload;
      })
      // Transaction Hash
      .addCase(sendTransactionHash.fulfilled, (state, action) => {
        state.transactionInfo = action.payload;
      })
      // Transaction Error Log
      .addCase(sendTransactionErrorLog.fulfilled, (state, action) => {
        state.transactionErrorLog = action.payload;
      })
      // Error handling
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.error.message;
        }
      );
  }
});

export const { clearError } = swapSlice.actions;
export default swapSlice.reducer;
