import { ReactNode } from 'react'

import { formatAmountToBRL } from '@/helpers/format-number-to-brl'

import { Card, CardContent } from './ui/card'

interface BalanceItemProps {
  label: string
  icon: ReactNode
  amount: number
}

const BalanceItem = ({ amount, icon, label }: BalanceItemProps) => {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-muted p-2">{icon}</div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>

        <h3 className="text-2xl font-semibold">{formatAmountToBRL(amount)}</h3>
      </CardContent>
    </Card>
  )
}

export default BalanceItem
