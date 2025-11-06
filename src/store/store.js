import { configureStore } from '@reduxjs/toolkit';
import swapReducer from './swapReducer';

 const store = configureStore({
  reducer: {
    swap: swapReducer,
  },
});

export default store;