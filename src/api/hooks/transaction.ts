import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthContext } from '@/context/auth'
import { CreateTransactionFormSchema } from '@/forms/schemas/transaction'

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
    },
  })
}
