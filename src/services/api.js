import axios from 'axios'

// En desarrollo Vite hace proxy de /api -> localhost:4567 (evita CORS)
const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL,
})
