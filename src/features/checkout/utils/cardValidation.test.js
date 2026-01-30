import {
  getCardBrand,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
  validateCvv,
} from './cardValidation';

describe('cardValidation', () => {
  describe('getCardBrand', () => {
    it('devuelve VISA para número que empieza con 4 y 16 dígitos', () => {
      expect(getCardBrand('4242424242424242')).toBe('VISA');
      expect(getCardBrand('4111111111111111')).toBe('VISA');
    });

    it('devuelve VISA para número que empieza con 4 y 13 dígitos', () => {
      expect(getCardBrand('4111111111111')).toBe('VISA');
    });

    it('devuelve MASTERCARD para rango 51-55', () => {
      expect(getCardBrand('5100000000000000')).toBe('MASTERCARD');
      expect(getCardBrand('5500000000000000')).toBe('MASTERCARD');
    });

    it('devuelve MASTERCARD para rango 2221-2720', () => {
      expect(getCardBrand('2221000000000000')).toBe('MASTERCARD');
      expect(getCardBrand('2720000000000000')).toBe('MASTERCARD');
    });

    it('devuelve null para número no reconocido', () => {
      expect(getCardBrand('1234567890123456')).toBe(null);
      expect(getCardBrand('')).toBe(null);
    });
  });

  describe('formatCardNumber', () => {
    it('agrupa dígitos de 4 en 4', () => {
      expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    });

    it('elimina caracteres no numéricos', () => {
      expect(formatCardNumber('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
    });

    it('limita a 19 dígitos', () => {
      expect(formatCardNumber('12345678901234567890').replace(/\s/g, '').length).toBeLessThanOrEqual(19);
    });
  });

  describe('formatExpiry', () => {
    it('formatea MM/YY con 4 dígitos', () => {
      expect(formatExpiry('1225')).toBe('12/25');
    });

    it('devuelve solo dígitos si hay menos de 4', () => {
      expect(formatExpiry('12')).toBe('12');
    });
  });

  describe('validateCardNumber', () => {
    it('acepta VISA 16 dígitos', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true);
    });

    it('acepta VISA 13 dígitos', () => {
      expect(validateCardNumber('4111111111111')).toBe(true);
    });

    it('acepta MasterCard 16 dígitos', () => {
      expect(validateCardNumber('5100000000000000')).toBe(true);
    });

    it('rechaza menos de 13 dígitos', () => {
      expect(validateCardNumber('123456789012')).toBe(false);
    });

    it('rechaza más de 19 dígitos', () => {
      expect(validateCardNumber('12345678901234567890')).toBe(false);
    });
  });

  describe('validateExpiry', () => {
    it('acepta MM/YY válido futuro', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 2);
      const yy = String(future.getFullYear()).slice(-2);
      const mm = String(future.getMonth() + 1).padStart(2, '0');
      expect(validateExpiry(mm + yy)).toBe(true);
    });

    it('rechaza si no son 4 dígitos', () => {
      expect(validateExpiry('12')).toBe(false);
      expect(validateExpiry('12345')).toBe(false);
    });

    it('rechaza mes inválido', () => {
      expect(validateExpiry('1325')).toBe(false);
      expect(validateExpiry('0025')).toBe(false);
    });
  });

  describe('validateCvv', () => {
    it('acepta 3 dígitos', () => {
      expect(validateCvv('123')).toBe(true);
    });

    it('acepta 4 dígitos', () => {
      expect(validateCvv('1234')).toBe(true);
    });

    it('rechaza 2 dígitos', () => {
      expect(validateCvv('12')).toBe(false);
    });

    it('rechaza 5 dígitos', () => {
      expect(validateCvv('12345')).toBe(false);
    });
  });
});
