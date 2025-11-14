import { Navigate } from 'react-router'

import Header from '@/components/header'
import { useAuthContext } from '@/context/auth'

const HomePage = () => {
  const { isTokensBeingValidated, user } = useAuthContext()

  if (isTokensBeingValidated) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <Header />
    </>
  )
}

export default HomePage
