import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { savePersistedCheckout } from './app/persistCheckout'
import App from './App'
import './styles/globals.css'

store.subscribe(() => {
  const state = store.getState()
  savePersistedCheckout(state.checkout)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
