import queryString from 'query-string'

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
  date: Date
  user_id: string
  name: string
  type: TransactionType
  amount: string
}

interface Transaction {
  id: string
  date: Date
  userId: string
  name: string
  type: TransactionType
  amount: string
}

interface GetAllTransactionsInputData {
  from?: string | null
  to?: string | null
}

interface TransactionServiceData {
  create: (data: CreateTransactionInputData) => Promise<Transaction>
  getAll: (data: GetAllTransactionsInputData) => Promise<Transaction[]>
}

export class TransactionService implements TransactionServiceData {
  async create({ date, name, type, amount }: CreateTransactionInputData) {
    const { data: createdTransaction } = await protectedApi.post<TransactionApiResponse>(
      '/transactions/me',
      {
        name,
        date,
        type,
        amount,
      }
    )

    return {
      id: createdTransaction.id,
      date: createdTransaction.date,
      userId: createdTransaction.user_id,
      name: createdTransaction.name,
      type: createdTransaction.type,
      amount: createdTransaction.amount,
    }
  }

  async getAll({ from, to }: GetAllTransactionsInputData) {
    const query = queryString.stringify({ from, to })
    const { data: transactions } = await protectedApi.get<TransactionApiResponse[]>(
      `/transactions/me?${query}`
    )

    return Promise.all(
      transactions.map(async (transaction) => {
        return {
          id: transaction.id,
          date: transaction.date,
          userId: transaction.user_id,
          name: transaction.name,
          type: transaction.type,
          amount: transaction.amount,
        }
      })
    )
  }
}
