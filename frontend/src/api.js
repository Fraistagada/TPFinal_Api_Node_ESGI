// Helpers d'appel à l'API + gestion simple du token JWT (localStorage).

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

// Décode le payload d'un JWT (pas de vérification de signature, juste lecture des claims: id, email, isAdmin)
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function getUser() {
  const token = getToken()
  return token ? decodeToken(token) : null
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Erreur serveur')
  }
  return data
}

export const api = {
  signup: (email, motDePasse) =>
    request('/signup', { method: 'POST', body: JSON.stringify({ email, motDePasse }) }),

  login: (email, motDePasse) =>
    request('/login', { method: 'POST', body: JSON.stringify({ email, motDePasse }) }),

  getMenu: () => request('/menu'),

  getMyReservations: () => request('/my-reservations'),

  getAllReservations: ({ date, status } = {}) => {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (status) params.set('statut', status)

    const queryString = params.toString()
    return request(queryString ? `/reservations?${queryString}` : '/reservations')
  },

  createReservation: (payload) =>
    request('/reservations', { method: 'POST', body: JSON.stringify(payload) }),

  cancelReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

  validateReservation: (id) => request(`/reservations/${id}/validate`, { method: 'PATCH' }),
}
