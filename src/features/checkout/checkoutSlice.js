import { createSlice } from '@reduxjs/toolkit'

export const checkoutInitialState = {
  items: [],
  cardInfo: {
    number: '',
    holder: '',
    exp: '',
    cvv: '',
    brand: null // 'VISA' | 'MASTERCARD'
  },
  deliveryInfo: {
    address: '',
    city: '',
    phone: ''
  },
  showModal: false,
  showSummary: false
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: checkoutInitialState,
  reducers: {
    addToCheckout: (state, action) => {
      state.items = [action.payload]
    },
    openModal: (s) => { s.showModal = true },
    closeModal: (s) => { s.showModal = false },
    openSummary: (s) => { s.showSummary = true },
    closeSummary: (s) => { s.showSummary = false },
    setCardInfo: (s, a) => { s.cardInfo = { ...s.cardInfo, ...a.payload } },
    setDeliveryInfo: (s, a) => { s.deliveryInfo = { ...s.deliveryInfo, ...a.payload } },
    resetCheckout: () => ({
      ...checkoutInitialState,
      cardInfo: { ...checkoutInitialState.cardInfo },
      deliveryInfo: { ...checkoutInitialState.deliveryInfo },
    })
  }
})

export const {
  addToCheckout,
  openModal,
  closeModal,
  openSummary,
  closeSummary,
  setCardInfo,
  setDeliveryInfo,
  resetCheckout
} = checkoutSlice.actions

export default checkoutSlice.reducer

