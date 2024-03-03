import useAuth from '../hooks/useAuth'
import AuthenticatedStack from './AuthenticatedStack'
import UnauthenticatedStack from './UnauthenticatedStack.js'

export default function Routes() {
  const { isAuthenticated } = useAuth()
  return (
    <>
      {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </>
  )
}
