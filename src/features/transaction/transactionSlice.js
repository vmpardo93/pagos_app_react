import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, completePayment as completePaymentApi } from '../../services/api';
import { tokenizeCard } from '../../services/wompi';

export const createPayment = createAsyncThunk(
  'transaction/createPayment',
  async (
    { product_id, quantity, card_number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/payments', {
        product_id,
        quantity: quantity ?? 1,
        card_number: String(card_number).replace(/\s/g, ''),
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? err.message ?? 'Error al procesar el pago'
      );
    }
  }
);

/**
 * Notifica al backend el resultado de Wompi para que actualice la transacción,
 * asigne entrega y actualice stock.
 */
export const confirmPaymentInBackend = createAsyncThunk(
  'transaction/confirmPaymentInBackend',
  async ({ transactionId, wompiResult }, { rejectWithValue }) => {
    try {
      const { data } = await completePaymentApi(transactionId, wompiResult);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? err.message ?? 'Error al confirmar pago'
      );
    }
  }
);

/**
 * Llama a la API de Wompi para tokenizar la tarjeta.
 * cardInfo: { number, exp "MM/YY", cvv, holder }
 * Respuesta Wompi: { status, data: { id, ... } }
 */
export const createWompiTransaction = createAsyncThunk(
  'transaction/createWompiTransaction',
  async (cardInfo, { rejectWithValue }) => {
    try {
      const exp = String(cardInfo.exp || '').replace(/\D/g, '');
      const exp_month = exp.slice(0, 2) || '01';
      const exp_year = exp.slice(2, 4) || '30';
      const response = await tokenizeCard({
        number: cardInfo.number,
        cvc: cardInfo.cvv,
        exp_month,
        exp_year,
        card_holder: cardInfo.holder || '',
      });
      return {
        id: response?.data?.id ?? response?.id,
        status: response?.status ?? response?.data?.status ?? 'UNKNOWN',
      };
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Error en API Wompi');
    }
  }
);

const initialState = {
  currentTransaction: null,
  wompiTransaction: null,
  history: [],
  status: 'idle',
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
      if (action.payload) {
        state.history.unshift(action.payload);
      }
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.wompiTransaction = null;
      state.status = 'idle';
      state.error = null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentTransaction = action.payload;
        state.error = null;
        if (action.payload) {
          state.history.unshift(action.payload);
        }
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = 'FAILED';
        state.error = action.payload ?? 'Error al procesar el pago';
        state.currentTransaction = null;
      })
      .addCase(createWompiTransaction.pending, (state) => {
        state.status = 'loading_wompi';
        state.error = null;
      })
      .addCase(createWompiTransaction.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.wompiTransaction = action.payload;
        state.error = null;
      })
      .addCase(createWompiTransaction.rejected, (state, action) => {
        state.status = 'FAILED';
        state.error = action.payload ?? 'Error en API Wompi';
        state.wompiTransaction = null;
      })
      .addCase(confirmPaymentInBackend.fulfilled, () => {
        // Backend actualizó transacción, entrega y stock
      })
      .addCase(confirmPaymentInBackend.rejected, () => {
        // No cambiamos estado; el usuario ya vio el resultado de Wompi
      });
  },
});

export const {
  setCurrentTransaction,
  clearCurrentTransaction,
  setStatus,
  setError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
