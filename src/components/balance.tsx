import { useQuery } from '@tanstack/react-query'
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { useAuthContext } from '@/context/auth'
import { UserService } from '@/services/user'

import BalanceItem from './balance-item'

const Balance = () => {
  const [searchParams] = useSearchParams()

  const { user } = useAuthContext()

  const { data: balance } = useQuery({
    queryKey: ['balance', user?.id],
    queryFn: async () => {
      const userService = new UserService()
      return userService.getBalance({
        from: String(searchParams.get('from')),
        to: String(searchParams.get('to')),
      })
    },
  })

  return (
    <div className="col-span-2 grid grid-cols-2 gap-6 py-6">
      <BalanceItem amount={Number(balance?.balance)} icon={<WalletIcon className="size-4" />} label="Saldo" />
      <BalanceItem
        amount={Number(balance?.earnings)}
        icon={<TrendingUpIcon className="size-4 text-primary-green" />}
        label="Ganhos"
      />
      <BalanceItem
        amount={Number(balance?.expenses)}
        icon={<TrendingDownIcon className="size-4 text-primary-red" />}
        label="Gastos"
      />
      <BalanceItem
        amount={Number(balance?.investments)}
        icon={<PiggyBankIcon className="size-4 text-primary-blue" />}
        label="Investimentos"
      />
    </div>
  )
}

export default Balance
