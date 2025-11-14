import { ReactNode } from 'react'

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

        <h3 className="text-2xl font-semibold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount)}
        </h3>
      </CardContent>
    </Card>
  )
}

export default BalanceItem
