export function removeLogin() {
  sessionStorage.removeItem('authorized')
  localStorage.removeItem('authorized')
}

export function setLogin() {
  sessionStorage.setItem('authorized', true)
  localStorage.setItem('authorized', true)
}

export function getLogin() {
  if (localStorage.getItem('authorized')) {
    sessionStorage.setItem('authorized', true)
    return true
  }
  return false
}
