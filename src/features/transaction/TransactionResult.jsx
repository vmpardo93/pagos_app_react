import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import { clearCurrentTransaction } from './transactionSlice';
import { resetCheckout } from '../../features/checkout/checkoutSlice';
import './TransactionResult.css';

const TransactionResult = () => {
  const dispatch = useDispatch();
  const { currentTransaction, wompiTransaction, status, error } = useSelector((state) => state.transaction);

  if (status === 'idle' || status === 'loading') {
    return null;
  }

  const transactionNumber =
    currentTransaction?.transaction_number ??
    currentTransaction?.transaction_id ??
    currentTransaction?.id ??
    currentTransaction?.numero_transaccion;

  const handleClose = () => {
    dispatch(clearCurrentTransaction());
    dispatch(resetCheckout());
  };

  const isSuccess = status === 'SUCCESS';

  return (
    <div className="transaction-result-backdrop" onClick={handleClose}>
      <div className="transaction-result" onClick={(e) => e.stopPropagation()}>
        <div className={`transaction-result__icon transaction-result__icon--${isSuccess ? 'success' : 'failed'}`}>
          {isSuccess ? '✓' : '✕'}
        </div>
        <h2 className="transaction-result__title">
          {isSuccess ? 'Pago realizado' : 'Pago rechazado'}
        </h2>
        {isSuccess && transactionNumber != null && (
          <p className="transaction-result__number">
            Número de transacción: <strong>{String(transactionNumber)}</strong>
          </p>
        )}
        {wompiTransaction && (
          <div className="transaction-result__wompi">
            <p className="transaction-result__wompi-row">
              <span>ID (Wompi):</span> <strong>{wompiTransaction.id ?? '—'}</strong>
            </p>
            <p className="transaction-result__wompi-row">
              <span>Estado:</span> <strong>{wompiTransaction.status ?? '—'}</strong>
            </p>
          </div>
        )}
        {!isSuccess && error && (
          <p className="transaction-result__error">{error}</p>
        )}
        <Button variant="primary" onClick={handleClose} className="transaction-result__btn">
          Aceptar
        </Button>
      </div>
    </div>
  );
};

export default TransactionResult;
