import axios from 'axios'

// En desarrollo Vite hace proxy de /api -> localhost:4567 (evita CORS)
const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL,
})

/**
 * Completa el pago en el backend: actualiza la transacción con el resultado
 * de Wompi, asigna entrega y actualiza stock.
 * Body: { wompi_id, wompi_status } o { wompi_token } según lo que espere el backend.
 */
export function completePayment(transactionId, wompiResult) {
  return api.patch(`/transactions/${transactionId}/complete`, {
    wompi_id: wompiResult?.id,
    wompi_status: wompiResult?.status,
    ...wompiResult,
  })
}
