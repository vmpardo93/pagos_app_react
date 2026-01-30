import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/products')
      const data = res.data
      return Array.isArray(data) ? data : (data?.products ?? [])
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? err.message)
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Error al cargar productos'
      })
  }
})

export default productSlice.reducer

