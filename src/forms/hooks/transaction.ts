import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
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

interface UseEditTransactionFormProps {
  transaction: Transaction
  onSuccess: () => void
  onError: () => void
}

const getEditTransactionFormDefaultValues = (transaction: Transaction) => ({
  name: transaction.name,
  amount: Number(transaction.amount),
  date: new Date(transaction.date),
  type: transaction.type,
})

export const useEditTransactionForm = ({
  onSuccess,
  onError,
  transaction,
}: UseEditTransactionFormProps) => {
  const { mutateAsync: editTransaction } = useEditTransaction()
  const form = useForm<EditTransactionFormSchema>({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: getEditTransactionFormDefaultValues(transaction),
    shouldUnregister: true,
  })

  useEffect(() => {
    form.reset(getEditTransactionFormDefaultValues(transaction))
    form.setValue('id', transaction.id)
  }, [form, transaction])

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
