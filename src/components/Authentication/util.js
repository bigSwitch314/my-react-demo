export function removeLogin() {
  sessionStorage.removeItem('authorized')
  localStorage.removeItem('authorized')
  sessionStorage.removeItem('token')
}

export function setLogin(token='') {
  sessionStorage.setItem('authorized', true)
  localStorage.setItem('authorized', true)
  sessionStorage.setItem('token', token)
}

export function getLogin() {
  if (localStorage.getItem('authorized')) {
    sessionStorage.setItem('authorized', true)
    return true
  }
  return false
}
