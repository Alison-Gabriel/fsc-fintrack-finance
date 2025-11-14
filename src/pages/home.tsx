import { PlusIcon } from 'lucide-react'
import { Navigate } from 'react-router'

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { useAuthContext } from '@/context/auth'

const HomePage = () => {
  const { isTokensBeingValidated, user } = useAuthContext()

  if (isTokensBeingValidated) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <Header />

      <div className="p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Button>
              Nova transação <PlusIcon />
            </Button>
          </div>
        </div>

        <div></div>
      </div>
    </>
  )
}

export default HomePage
