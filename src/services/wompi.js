/**
 * Wompi API - Sandbox (URL fija según requisito)
 * Authorization con llave pública (tokenización desde frontend).
 */
const WOMPI_BASE_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
const WOMPI_PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';

async function wompiRequest(endpoint, options = {}) {
  const url = `${WOMPI_BASE_URL}${endpoint}`;
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
      ...options.headers,
    },
    ...options,
  };
  if (options.body && !config.body) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.reason || data?.message || `Wompi: ${response.status}`);
  }

  return data;
}

/**
 * Tokeniza la tarjeta (POST /tokens/cards).
 * Body: number, cvc, exp_month, exp_year, card_holder
 * Respuesta: { status, data: { id, ... } }
 */
export function tokenizeCard({ number, cvc, exp_month, exp_year, card_holder }) {
  return wompiRequest('/tokens/cards', {
    method: 'POST',
    body: {
      number: String(number).replace(/\s/g, ''),
      cvc: String(cvc),
      exp_month: String(exp_month).padStart(2, '0'),
      exp_year: String(exp_year).length === 2 ? exp_year : String(exp_year).slice(-2),
      card_holder: String(card_holder).trim(),
    },
  });
}

export default { tokenizeCard };
