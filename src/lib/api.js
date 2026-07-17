const TOKEN_KEY = 'token'
const USER_KEY = 'username'
const ADMIN_KEY = 'is_admin'

const API_BASE = import.meta.env.VITE_API_URL || ''

export { API_BASE }

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function authHeader() {
  const token = getToken()
  return token ? { Authorization: 'Bearer ' + token } : {}
}

export function setAuth(token, username, isAdmin) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, username)
  localStorage.setItem(ADMIN_KEY, isAdmin ? '1' : '0')
  notifyAuthChange()
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ADMIN_KEY)
  notifyAuthChange()
}

// Lets Navbar react to login/logout without a full page reload.
export function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-change'))
}

export function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === '1'
}

// Thin fetch wrapper: throws on non-2xx with parsed detail so callers stay terse.
export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: { ...(options.headers || {}), ...authHeader() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.detail || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
