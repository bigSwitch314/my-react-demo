import { getLogin } from './util'

function Authorized(props) {
  const { children, noMatched } = props
  const login = getLogin()
  return login ? children : noMatched
}

export default Authorized
