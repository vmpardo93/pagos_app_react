import { useSelector } from 'react-redux'

import ProductPage from './features/product/ProductPage'
import PaymentModal from './features/checkout/PaymentModal'
import PaymentSummary from './features/checkout/PaymentSummary'
import WompiLoading from './features/transaction/WompiLoading'
import TransactionResult from './features/transaction/TransactionResult'

function App() {
  const { showModal, showSummary } = useSelector(state => state.checkout)
  const { status } = useSelector(state => state.transaction)

  return (
    <div className="container">
      {/* Main product view */}
      <ProductPage />

      {/* Credit card modal */}
      {showModal && <PaymentModal />}

      {/* Payment summary backdrop */}
      {showSummary && <PaymentSummary />}

      {/* Cargando API de Wompi */}
      {status === 'loading_wompi' && <WompiLoading />}

      {/* Transaction result (id y status de Wompi) */}
      {(status === 'SUCCESS' || status === 'FAILED') && (
        <TransactionResult />
      )}
    </div>
  )
}

export default App

