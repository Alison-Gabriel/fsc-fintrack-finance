import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ExternalLinkIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { useGetTransactions } from '@/api/hooks/transaction'
import { Transaction } from '@/api/services/transaction'
import { formatAmountToBRL } from '@/helpers/format-number-to-brl'

import TransactionTypeBadge from './transaction-type-badge'
import { Button } from './ui/button'
import { DataTable } from './ui/data-table'

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'name',
    header: 'Título',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row: { original: transaction } }) => {
      return <TransactionTypeBadge variant={transaction.type} />
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row: { original: transaction } }) => {
      return format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    },
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row: { original: transaction } }) => {
      return formatAmountToBRL(Number(transaction.amount))
    },
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: () => {
      return (
        <Button variant="ghost" size="icon">
          <ExternalLinkIcon className="text-muted-foreground" />
        </Button>
      )
    },
  },
]

const TransactionsTable = () => {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data: transactions } = useGetTransactions({ from, to })
  const hasNotTransactions = !transactions

  if (hasNotTransactions) return null

  return <DataTable columns={columns} data={transactions} />
}

export default TransactionsTable
