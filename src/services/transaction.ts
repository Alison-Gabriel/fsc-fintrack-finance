import { protectedApi } from '@/lib/axios'

type TransactionType = 'EARNING' | 'EXPENSE' | 'INVESTMENT'

interface CreateTransactionInputData {
  date: Date
  name: string
  type: TransactionType
  amount: number
}

interface TransactionApiResponse {
  id: string
  user_id: string
  name: string
  type: TransactionType
  amount: string
}

interface Transaction {
  id: string
  userId: string
  name: string
  type: TransactionType
  amount: string
}

interface TransactionServiceData {
  create: (data: CreateTransactionInputData) => Promise<Transaction>
}

export class TransactionService implements TransactionServiceData {
  async create({ date, name, type, amount }: CreateTransactionInputData) {
    const { data: createdTransaction } = await protectedApi.post<TransactionApiResponse>('/transactions/me', {
      name,
      date,
      type,
      amount,
    })

    return {
      id: createdTransaction.id,
      userId: createdTransaction.user_id,
      name: createdTransaction.name,
      type: createdTransaction.type,
      amount: createdTransaction.amount,
    }
  }
}
