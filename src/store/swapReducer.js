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
  try {
  const { data } = await axios({
     baseURL: __BASEAPIURL__,
    // baseURL:` http://localhost:8000/`,
    url: endpoint,
    method: method.toLowerCase(),
    ...(body && method === 'POST' && { data: payload }),
    ...(body && method === 'GET' && { params: payload }),
  });
  // if (data.status !== 200) {
  //   // throw with a clean message
  //   throw new Error(data.result || 'API request failed');
  // }
  // if (data.status !== 200 ) throw new Error(data.result);
  if (data.status !== 200) {
    // Instead of throwing Error, throw an object that thunk can catch
    throw { isApiError: true, data };
  }
  return data.result;
}
catch (error) {
  console.log('api error ',error)
  if (error.status===400 && error?.response?.data) {
    // Pass API error up
    throw error?.response?.data?.result || error.code;
  }
  throw error;
}
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
      .addCase(swapToken.pending, (state) => { state.loading = true; })
      .addCase(swapToken.fulfilled, (state, action) => {
        state.loading = false;
        state.swapResult = action.payload;
      })
      .addCase(swapToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
        (action) => action.type.endsWith('/rejected')  ,
        (state, action) => {
          state.error = action.error.message;
        }
      );
  }
});

export const { clearError } = swapSlice.actions;
export default swapSlice.reducer;
