
export const selectBalance = (state) => state.swap.balance;
export const selectInfo = (state) => state.swap.info;
export const selectSwaps = (state) => state.swap.swaps;
export const selectUnconfirmedBeldexTxs=(state) => state.swap.unconfirmedBeldexTxs;
export const selectSwapLoading = (state) => state.swap.loading;
export const selectSwapError = (state) => state.swap.error;
export const selectswapResult=(state)=>state.swap.swapResult;