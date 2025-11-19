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
import { ScrollArea } from './ui/scroll-area'

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
        <Button variant="ghost" size="icon" className="rounded-lg">
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

  return (
    <>
      <h2 className="text-2xl font-bold">Transações</h2>

      <ScrollArea className="h-[450px] max-h-[450px] rounded-lg ring-2 ring-border/50">
        <DataTable columns={columns} data={transactions} />
      </ScrollArea>
    </>
  )
}

export default TransactionsTable
