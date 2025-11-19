import { cva, VariantProps } from 'class-variance-authority'
import { CircleIcon } from 'lucide-react'

const badgeVariants = cva(
  'flex w-fit items-center gap-[4.5px] rounded-full px-2 py-[2px] text-xs font-bold',
  {
    variants: {
      variant: {
        EARNING: 'text-primary-green bg-primary-green/10 fill-primary-green',
        EXPENSE: 'text-primary-red bg-primary-red/10 fill-primary-red',
        INVESTMENT: 'text-primary-blue bg-primary-blue/10 fill-primary-blue',
      },
    },
  }
)

type TransactionTypeBadgeProps = VariantProps<typeof badgeVariants>

const getBadgeTextLabel = ({ variant }: TransactionTypeBadgeProps) => {
  if (variant === 'EARNING') {
    return 'Ganho'
  }
  if (variant === 'EXPENSE') {
    return 'Gasto'
  }
  if (variant === 'INVESTMENT') {
    return 'Investimento'
  }
}

const TransactionTypeBadge = ({ variant }: TransactionTypeBadgeProps) => {
  return (
    <div className={badgeVariants({ variant })}>
      <CircleIcon className={`size-2 fill-inherit`} />
      {getBadgeTextLabel({ variant })}
    </div>
  )
}

export default TransactionTypeBadge
