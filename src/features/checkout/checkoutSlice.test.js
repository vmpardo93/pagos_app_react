import checkoutReducer, {
  addToCheckout,
  openModal,
  closeModal,
  openSummary,
  closeSummary,
  setCardInfo,
  setDeliveryInfo,
  resetCheckout,
} from './checkoutSlice';

const initialState = {
  items: [],
  cardInfo: {
    number: '',
    holder: '',
    exp: '',
    cvv: '',
    brand: null,
  },
  deliveryInfo: {
    address: '',
    city: '',
    phone: '',
  },
  showModal: false,
  showSummary: false,
};

describe('checkoutSlice', () => {
  it('devuelve el estado inicial', () => {
    expect(checkoutReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('addToCheckout asigna el producto como único ítem', () => {
    const product = { id: 1, name: 'Laptop', price: 1000 };
    const state = checkoutReducer(initialState, addToCheckout(product));
    expect(state.items).toEqual([product]);
  });

  it('openModal pone showModal en true', () => {
    const state = checkoutReducer(initialState, openModal());
    expect(state.showModal).toBe(true);
  });

  it('closeModal pone showModal en false', () => {
    const withModal = checkoutReducer(initialState, openModal());
    const state = checkoutReducer(withModal, closeModal());
    expect(state.showModal).toBe(false);
  });

  it('openSummary pone showSummary en true', () => {
    const state = checkoutReducer(initialState, openSummary());
    expect(state.showSummary).toBe(true);
  });

  it('closeSummary pone showSummary en false', () => {
    const withSummary = checkoutReducer(initialState, openSummary());
    const state = checkoutReducer(withSummary, closeSummary());
    expect(state.showSummary).toBe(false);
  });

  it('setCardInfo actualiza los datos de la tarjeta', () => {
    const payload = { number: '4242424242424242', holder: 'Juan Pérez', cvv: '123' };
    const state = checkoutReducer(initialState, setCardInfo(payload));
    expect(state.cardInfo.number).toBe('4242424242424242');
    expect(state.cardInfo.holder).toBe('Juan Pérez');
    expect(state.cardInfo.cvv).toBe('123');
  });

  it('setDeliveryInfo actualiza los datos de entrega', () => {
    const payload = { address: 'Calle 1', city: 'Bogotá', phone: '3001234567' };
    const state = checkoutReducer(initialState, setDeliveryInfo(payload));
    expect(state.deliveryInfo.address).toBe('Calle 1');
    expect(state.deliveryInfo.city).toBe('Bogotá');
    expect(state.deliveryInfo.phone).toBe('3001234567');
  });

  it('resetCheckout restaura el estado inicial', () => {
    const withData = checkoutReducer(initialState, addToCheckout({ id: 1, name: 'X', price: 10 }));
    const withModal = checkoutReducer(withData, openModal());
    const state = checkoutReducer(withModal, resetCheckout());
    expect(state).toEqual(initialState);
  });
});
