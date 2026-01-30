import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import transactionReducer from '../features/transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
});
