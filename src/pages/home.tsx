import { Navigate } from 'react-router'

import { useAuthContext } from '@/context/auth'

const HomePage = () => {
  const { isTokensBeingValidated, user } = useAuthContext()

  if (isTokensBeingValidated) return null
  if (!user) return <Navigate to="/login" replace />

  return <h1>Home page</h1>
}

export default HomePage
