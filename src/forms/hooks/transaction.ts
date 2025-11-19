import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateTransaction, useEditTransaction } from '@/api/hooks/transaction'
import { Transaction } from '@/api/services/transaction'
import {
  CreateTransactionFormSchema,
  createTransactionFormSchema,
  EditTransactionFormSchema,
  editTransactionFormSchema,
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

interface UseCreateTransactionFormProps {
  transaction: Transaction
  onSuccess: () => void
  onError: () => void
}

export const useEditTransactionForm = ({
  onSuccess,
  onError,
  transaction,
}: UseCreateTransactionFormProps) => {
  const { mutateAsync: editTransaction } = useEditTransaction()
  const form = useForm<EditTransactionFormSchema>({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: {
      id: transaction.id,
      name: transaction.name,
      amount: Number(transaction.amount),
      date: transaction.date,
      type: transaction.type,
    },
    shouldUnregister: true,
  })

  const handleEditTransaction = async (data: EditTransactionFormSchema) => {
    try {
      await editTransaction(data)
      onSuccess()
    } catch (error) {
      console.error((error as Error).message)
      onError()
    }
  }

  return { form, handleEditTransaction }
}
