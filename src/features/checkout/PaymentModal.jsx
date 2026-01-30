import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import {
  closeModal,
  openSummary,
  setCardInfo,
  setDeliveryInfo,
} from './checkoutSlice';
import {
  getCardBrand,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
  validateCvv,
} from './utils/cardValidation';
import './PaymentModal.css';

const INITIAL_CARD = { number: '', exp: '', cvv: '', holder: '' };
const INITIAL_DELIVERY = { address: '', city: '', phone: '' };

export default function PaymentModal() {
  const dispatch = useDispatch();
  const { cardInfo, deliveryInfo } = useSelector((state) => state.checkout);
  const [card, setCard] = useState({
    number: cardInfo.number || '',
    exp: cardInfo.exp || '',
    cvv: cardInfo.cvv || '',
    holder: cardInfo.holder || '',
  });
  const [delivery, setDelivery] = useState({
    address: deliveryInfo.address || '',
    city: deliveryInfo.city || '',
    phone: deliveryInfo.phone || '',
  });
  const [errors, setErrors] = useState({});

  const brand = getCardBrand(card.number);

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 19);
    const formatted = formatCardNumber(raw);
    setCard((prev) => ({ ...prev, number: formatted }));
    setErrors((prev) => ({ ...prev, number: '' }));
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = formatExpiry(raw);
    setCard((prev) => ({ ...prev, exp: formatted }));
    setErrors((prev) => ({ ...prev, exp: '' }));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, cvv: value }));
    setErrors((prev) => ({ ...prev, cvv: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateCardNumber(card.number)) {
      newErrors.number = 'Número de tarjeta inválido (VISA 13/16 dígitos, MasterCard 16 dígitos)';
    }
    if (!validateExpiry(card.exp)) {
      newErrors.exp = 'Fecha de vencimiento inválida (MM/YY)';
    }
    if (!validateCvv(card.cvv)) {
      newErrors.cvv = 'CVV debe ser 3 o 4 dígitos';
    }
    if (!card.holder.trim()) {
      newErrors.holder = 'Nombre del titular es requerido';
    }
    if (!delivery.address.trim()) {
      newErrors.address = 'Dirección es requerida';
    }
    if (!delivery.city.trim()) {
      newErrors.city = 'Ciudad es requerida';
    }
    if (!delivery.phone.trim()) {
      newErrors.phone = 'Teléfono es requerido';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    dispatch(
      setCardInfo({
        number: card.number.replace(/\s/g, ''),
        exp: card.exp,
        cvv: card.cvv,
        holder: card.holder.trim(),
        brand,
      })
    );
    dispatch(
      setDeliveryInfo({
        address: delivery.address.trim(),
        city: delivery.city.trim(),
        phone: delivery.phone.trim(),
      })
    );
    dispatch(closeModal());
    dispatch(openSummary());
  };

  return (
    <Modal isOpen onClose={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal__header">
          <h2>Pagar con tarjeta</h2>
          <button
            type="button"
            className="payment-modal__close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="payment-modal__form">
          <section className="payment-modal__section">
            <h3>Datos de la tarjeta</h3>
            <div className="payment-modal__card-logos">
              <span
                className={`payment-modal__logo ${brand === 'VISA' ? 'payment-modal__logo--active' : ''}`}
                aria-hidden
              >
                VISA
              </span>
              <span
                className={`payment-modal__logo ${brand === 'MASTERCARD' ? 'payment-modal__logo--active' : ''}`}
                aria-hidden
              >
                MasterCard
              </span>
            </div>
            <div className="payment-modal__field">
              <label htmlFor="card-number">Número de tarjeta</label>
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={handleCardNumberChange}
                className={errors.number ? 'payment-modal__input--error' : ''}
              />
              {errors.number && (
                <span className="payment-modal__error">{errors.number}</span>
              )}
            </div>
            <div className="payment-modal__row">
              <div className="payment-modal__field">
                <label htmlFor="card-exp">Vencimiento (MM/YY)</label>
                <input
                  id="card-exp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={card.exp}
                  onChange={handleExpiryChange}
                  className={errors.exp ? 'payment-modal__input--error' : ''}
                />
                {errors.exp && (
                  <span className="payment-modal__error">{errors.exp}</span>
                )}
              </div>
              <div className="payment-modal__field">
                <label htmlFor="card-cvv">CVV</label>
                <input
                  id="card-cvv"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="123"
                  value={card.cvv}
                  onChange={handleCvvChange}
                  className={errors.cvv ? 'payment-modal__input--error' : ''}
                />
                {errors.cvv && (
                  <span className="payment-modal__error">{errors.cvv}</span>
                )}
              </div>
            </div>
            <div className="payment-modal__field">
              <label htmlFor="card-holder">Nombre del titular</label>
              <input
                id="card-holder"
                type="text"
                autoComplete="cc-name"
                placeholder="Como aparece en la tarjeta"
                value={card.holder}
                onChange={(e) => {
                  setCard((prev) => ({ ...prev, holder: e.target.value }));
                  setErrors((prev) => ({ ...prev, holder: '' }));
                }}
                className={errors.holder ? 'payment-modal__input--error' : ''}
              />
              {errors.holder && (
                <span className="payment-modal__error">{errors.holder}</span>
              )}
            </div>
          </section>

          <section className="payment-modal__section">
            <h3>Datos de entrega</h3>
            <div className="payment-modal__field">
              <label htmlFor="delivery-address">Dirección</label>
              <input
                id="delivery-address"
                type="text"
                autoComplete="street-address"
                placeholder="Calle, número, piso"
                value={delivery.address}
                onChange={(e) => {
                  setDelivery((prev) => ({ ...prev, address: e.target.value }));
                  setErrors((prev) => ({ ...prev, address: '' }));
                }}
                className={errors.address ? 'payment-modal__input--error' : ''}
              />
              {errors.address && (
                <span className="payment-modal__error">{errors.address}</span>
              )}
            </div>
            <div className="payment-modal__field">
              <label htmlFor="delivery-city">Ciudad</label>
              <input
                id="delivery-city"
                type="text"
                autoComplete="address-level2"
                placeholder="Ciudad"
                value={delivery.city}
                onChange={(e) => {
                  setDelivery((prev) => ({ ...prev, city: e.target.value }));
                  setErrors((prev) => ({ ...prev, city: '' }));
                }}
                className={errors.city ? 'payment-modal__input--error' : ''}
              />
              {errors.city && (
                <span className="payment-modal__error">{errors.city}</span>
              )}
            </div>
            <div className="payment-modal__field">
              <label htmlFor="delivery-phone">Teléfono</label>
              <input
                id="delivery-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Teléfono de contacto"
                value={delivery.phone}
                onChange={(e) => {
                  setDelivery((prev) => ({ ...prev, phone: e.target.value }));
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                className={errors.phone ? 'payment-modal__input--error' : ''}
              />
              {errors.phone && (
                <span className="payment-modal__error">{errors.phone}</span>
              )}
            </div>
          </section>

          <div className="payment-modal__actions">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Continuar al resumen
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
