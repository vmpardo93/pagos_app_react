import productReducer, { fetchProducts } from './productSlice';

jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const { api } = require('../../services/api');

describe('productSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('devuelve el estado inicial', () => {
    expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetchProducts.pending pone loading en true y error en null', () => {
    const state = productReducer(initialState, fetchProducts.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('fetchProducts.fulfilled guarda los items y quita loading', () => {
    const products = [
      { id: 1, name: 'Laptop', price: 1000 },
      { id: 2, name: 'Mouse', price: 25 },
    ];
    const state = productReducer(
      { ...initialState, loading: true },
      fetchProducts.fulfilled(products)
    );
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(products);
    expect(state.error).toBe(null);
  });

  it('fetchProducts.rejected guarda el error y quita loading', () => {
    const state = productReducer(
      { ...initialState, loading: true },
      fetchProducts.rejected(null, '', undefined, 'Error de red')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error de red');
    expect(state.items).toEqual([]);
  });
});

describe('fetchProducts thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('llama a api.get("/products") y devuelve array', async () => {
    const products = [{ id: 1, name: 'Laptop', price: 1000 }];
    api.get.mockResolvedValueOnce({ data: products });

    const dispatch = jest.fn();
    const getState = () => ({});

    const result = await fetchProducts()(dispatch, getState, undefined);
    expect(api.get).toHaveBeenCalledWith('/products');
    expect(result.payload).toEqual(products);
  });

  it('normaliza respuesta cuando viene { products: [] }', async () => {
    const products = [{ id: 1, name: 'X', price: 10 }];
    api.get.mockResolvedValueOnce({ data: { products } });

    const dispatch = jest.fn();
    const getState = () => ({});

    const result = await fetchProducts()(dispatch, getState, undefined);
    expect(result.payload).toEqual(products);
  });
});
