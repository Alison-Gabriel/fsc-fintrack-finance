import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { useGetUserBalance } from '@/api/hooks/user'

import BalanceItem from './balance-item'

const Balance = () => {
  const [searchParams] = useSearchParams()

  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data } = useGetUserBalance({ from, to })

  return (
    <div className="col-span-2 grid grid-cols-2 gap-6 py-6">
      <BalanceItem
        amount={Number(data?.balance)}
        icon={<WalletIcon className="size-4" />}
        label="Saldo"
      />
      <BalanceItem
        amount={Number(data?.earnings)}
        icon={<TrendingUpIcon className="size-4 text-primary-green" />}
        label="Ganhos"
      />
      <BalanceItem
        amount={Number(data?.expenses)}
        icon={<TrendingDownIcon className="size-4 text-primary-red" />}
        label="Gastos"
      />
      <BalanceItem
        amount={Number(data?.investments)}
        icon={<PiggyBankIcon className="size-4 text-primary-blue" />}
        label="Investimentos"
      />
    </div>
  )
}

export default Balance
