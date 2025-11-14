import { PlusIcon } from 'lucide-react'
import { Navigate } from 'react-router'

import Balance from '@/components/balance'
import { DateSelector } from '@/components/date-selector'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/context/auth'

const HomePage = () => {
  const { isTokensBeingValidated, user } = useAuthContext()

  if (isTokensBeingValidated) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <Header />

      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="flex items-center gap-2">
            <DateSelector />
            <Button>
              Nova transação <PlusIcon />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Balance />
        </div>
      </div>
    </>
  )
}

export default HomePage
