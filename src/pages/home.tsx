import { Navigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/context/auth'

const HomePage = () => {
  const { isTokensBeingValidated, user, signout } = useAuthContext()

  if (isTokensBeingValidated) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <h1>Bem vindo, {user.first_name}!</h1>
      <Button variant="destructive" onClick={signout}>
        Sair da conta
      </Button>
    </>
  )
}

export default HomePage
