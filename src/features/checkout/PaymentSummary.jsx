import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import { closeSummary, resetCheckout } from './checkoutSlice';
import { createPayment, createWompiTransaction, setStatus } from '../transaction/transactionSlice';
import './PaymentSummary.css';

const BASE_FEE = 2.5;
const DELIVERY_FEE = 5;

export default function PaymentSummary() {
  const dispatch = useDispatch();
  const { items, cardInfo, deliveryInfo } = useSelector((state) => state.checkout);
  const { status: transactionStatus } = useSelector((state) => state.transaction);
  const [payError, setPayError] = useState(null);

  const productAmount = items.reduce(
    (sum, item) => sum + Number(item.price ?? 0),
    0
  );
  const total = productAmount + BASE_FEE + DELIVERY_FEE;
  const isPaying = transactionStatus === 'loading';

  const handleBackdropClick = () => {
    if (!isPaying) dispatch(closeSummary());
  };

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  const handlePay = async () => {
    if (items.length === 0 || !cardInfo?.number) return;
    setPayError(null);
    try {
      await dispatch(
        createPayment({
          product_id: items[0].id,
          quantity: 1,
          card_number: cardInfo.number,
        })
      ).unwrap();
      dispatch(closeSummary());
      dispatch(setStatus('loading_wompi'));
      try {
        await dispatch(createWompiTransaction(cardInfo)).unwrap();
      } catch {
        // status = FAILED y error se muestran en TransactionResult
      }
      dispatch(resetCheckout());
    } catch (err) {
      setPayError(err ?? 'Error al procesar el pago');
      dispatch(closeSummary());
      dispatch(resetCheckout());
    }
  };

  return (
    <div
      className="payment-summary-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-summary-title"
      onClick={handleBackdropClick}
    >
      <div className="payment-summary" onClick={handlePanelClick}>
          <div className="payment-summary__header">
            <h2 id="payment-summary-title">Resumen de pago</h2>
            <button
              type="button"
              className="payment-summary__close"
              onClick={handleBackdropClick}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <div className="payment-summary__body">
            <ul className="payment-summary__lines">
              <li className="payment-summary__line">
                <span>Producto(s)</span>
                <span>${productAmount.toFixed(2)}</span>
              </li>
              <li className="payment-summary__line">
                <span>Tarifa base</span>
                <span>${BASE_FEE.toFixed(2)}</span>
              </li>
              <li className="payment-summary__line">
                <span>Envío</span>
                <span>${DELIVERY_FEE.toFixed(2)}</span>
              </li>
            </ul>

            <div className="payment-summary__total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {deliveryInfo?.address && (
              <div className="payment-summary__delivery">
                <p className="payment-summary__delivery-title">Envío a</p>
                <p>
                  {deliveryInfo.address}, {deliveryInfo.city}
                </p>
                {deliveryInfo.phone && <p>{deliveryInfo.phone}</p>}
              </div>
            )}
          </div>

          {payError && (
            <div className="payment-summary__pay-error" role="alert">
              {payError}
            </div>
          )}
          <div className="payment-summary__actions">
            <Button
              variant="primary"
              className="payment-summary__pay"
              onClick={handlePay}
              disabled={isPaying}
            >
              {isPaying ? 'Procesando…' : 'Pagar'}
            </Button>
          </div>
        </div>
      </div>
  );
}
