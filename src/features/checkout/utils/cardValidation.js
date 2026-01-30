/**
 * Detect card brand from number (VISA starts with 4, MasterCard 51-55 or 2221-2720).
 * Numbers are fake but must follow structure; no real API validation.
 */
export function getCardBrand(number) {
  const digits = (number || '').replace(/\D/g, '')
  if (digits.startsWith('4') && (digits.length === 13 || digits.length === 16)) return 'VISA'
  if (digits.length >= 4) {
    const firstTwo = parseInt(digits.slice(0, 2), 10)
    const firstFour = parseInt(digits.slice(0, 4), 10)
    if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) return 'MASTERCARD'
  }
  return null
}

export function formatCardNumber(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 19)
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join(' ').trim()
}

export function formatExpiry(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function validateCardNumber(number) {
  const digits = (number || '').replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  const brand = getCardBrand(number)
  if (brand === 'VISA' && digits.length !== 13 && digits.length !== 16) return false
  if (brand === 'MASTERCARD' && digits.length !== 16) return false
  return true
}

export function validateExpiry(exp) {
  const digits = (exp || '').replace(/\D/g, '')
  if (digits.length !== 4) return false
  const mm = parseInt(digits.slice(0, 2), 10)
  const yy = parseInt(digits.slice(2, 4), 10)
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const currentYY = now.getFullYear() % 100
  const currentMM = now.getMonth() + 1
  if (yy < currentYY) return false
  if (yy === currentYY && mm < currentMM) return false
  return true
}

export function validateCvv(cvv) {
  const digits = (cvv || '').replace(/\D/g, '')
  return digits.length === 3 || digits.length === 4
}
