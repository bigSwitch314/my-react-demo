export function removeLogin() {
  sessionStorage.removeItem('authorized')
  localStorage.removeItem('authorized')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('userInfo')
}

export function setLogin(payload) {
  const { token, user_name, user_id } = payload
  sessionStorage.setItem('authorized', true)
  localStorage.setItem('authorized', true)
  sessionStorage.setItem('token', token)
  // 登录用户信息
  const userInfo = {
    userName: user_name || '',
    userId: user_id || '',
  }
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function getLogin() {
  if (localStorage.getItem('authorized')) {
    sessionStorage.setItem('authorized', true)
    return true
  }
  return false
}
