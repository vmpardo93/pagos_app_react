import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import checkoutReducer, { checkoutInitialState } from '../features/checkout/checkoutSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import { loadPersistedCheckout } from './persistCheckout';

const preloadedCheckout = loadPersistedCheckout(checkoutInitialState);

export const store = configureStore({
  reducer: {
    product: productReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
  preloadedState: preloadedCheckout
    ? { checkout: preloadedCheckout }
    : undefined,
});
