import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateTransaction } from '@/api/hooks/transaction'
import {
  CreateTransactionFormSchema,
  createTransactionFormSchema,
} from '@/forms/schemas/transaction'

interface UseCreateTransactionFormProps {
  onSuccess: () => void
  onError: () => void
}

export const useCreateTransactionForm = ({ onSuccess, onError }: UseCreateTransactionFormProps) => {
  const { mutateAsync: createTransaction } = useCreateTransaction()

  const form = useForm<CreateTransactionFormSchema>({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      name: '',
      amount: 0,
      date: new Date(),
      type: 'EARNING',
    },
    shouldUnregister: true,
  })

  const handleCreateTransaction = async (data: CreateTransactionFormSchema) => {
    try {
      await createTransaction(data)
      onSuccess()
    } catch (error) {
      console.error((error as Error).message)
      onError()
    }
  }

  return { form, handleCreateTransaction }
}
