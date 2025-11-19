import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthContext } from '@/context/auth'
import { CreateTransactionFormSchema, EditTransactionFormSchema } from '@/forms/schemas/transaction'

import { TransactionService } from '../services/transaction'
import { getUserBalanceQueryKey } from './user'

const getCreateTransactionMutationKey = () => ['create-transaction']

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationKey: getCreateTransactionMutationKey(),
    mutationFn: async (variables: CreateTransactionFormSchema) => {
      const transactionService = new TransactionService()
      return transactionService.create(variables)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user?.id }),
      })
      queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey({ userId: user?.id }),
      })
    },
  })
}

interface UseGetTransactionsProps {
  from?: string | null
  to?: string | null
}

interface GetTransactionsQueryKeyProps extends UseGetTransactionsProps {
  userId?: string
}

export const getTransactionsQueryKey = ({ userId, from, to }: GetTransactionsQueryKeyProps) => {
  if (!from || !to) {
    return ['transactions', userId]
  }

  return ['transactions', userId, from, to]
}

export const useGetTransactions = ({ from, to }: UseGetTransactionsProps) => {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: getTransactionsQueryKey({ userId: user?.id, from, to }),
    queryFn: async () => {
      const transactionService = new TransactionService()
      const transactions = await transactionService.getAll({ from, to })
      return transactions
    },
    enabled: Boolean(from) && Boolean(to) && Boolean(user?.id),
  })
}

export const getEditTransactionMutationKey = () => ['edit-transaction']

export const useEditTransaction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationKey: getEditTransactionMutationKey(),
    mutationFn: async (variables: EditTransactionFormSchema) => {
      const transactionService = new TransactionService()
      return transactionService.update(variables)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user?.id }),
      })
      queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey({ userId: user?.id }),
      })
    },
  })
}
