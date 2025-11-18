import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Loader2Icon,
  PiggyBankIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import z from 'zod'

import { getUserBalanceQueryKey } from '@/api/hooks/user'
import { TransactionService } from '@/api/services/transaction'
import { useAuthContext } from '@/context/auth'

import { Button } from './ui/button'
import { DatePicker } from './ui/date-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const transactionSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome inválido',
      required_error: 'O nome da transação é obrigatório.',
    })
    .trim()
    .min(1, {
      message: 'O nome da transação é obrigatório.',
    }),
  amount: z.number({
    invalid_type_error: 'Valor inválido',
    required_error: 'O valor é obrigatório',
  }),
  date: z.date({
    invalid_type_error: 'Data inválida.',
    required_error: 'A data da transação é obrigatória.',
  }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    invalid_type_error: 'Tipo de transação inválido.',
    required_error: 'O tipo da transação é obrigatório.',
  }),
})

type TransactionSchema = z.infer<typeof transactionSchema>

const NewTransactionButton = () => {
  const queryClient = useQueryClient()

  const { user } = useAuthContext()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { mutate: createTransaction, isPending: isCreatingTransaction } = useMutation({
    mutationKey: ['new-transaction'],
    mutationFn: async (variables: TransactionSchema) => {
      const transactionService = new TransactionService()
      return transactionService.create({
        name: variables.name,
        date: variables.date,
        amount: variables.amount,
        type: variables.type,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user?.id }),
      })
    },
  })

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: '',
      amount: 0,
      date: new Date(),
      type: 'EARNING',
    },
    shouldUnregister: true,
  })

  const handleSubmitTransaction = (data: TransactionSchema) => {
    createTransaction(data, {
      onSuccess: () => {
        toast.success('Transação criada com sucesso!')
        setIsDialogOpen(false)
      },
      onError: () => {
        toast.error('Erro ao criar transação, tente novamente.')
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          Nova transação <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Adicionar transação</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Insira as informações abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitTransaction)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome da transação" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <NumericFormat
                      {...field}
                      placeholder="Digite o valor da transação"
                      onValueChange={(values) => field.onChange(values.floatValue)}
                      onChange={() => {}}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$"
                      allowNegative={false}
                      customInput={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      onChange={(value) => field.onChange(value)}
                      placeholder="Selecione a data da transação"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={`${field.value === 'EARNING' ? 'secondary' : 'outline'}`}
                        className="flex items-center gap-2"
                        type="button"
                        onClick={() => field.onChange('EARNING')}
                      >
                        <TrendingUpIcon className="text-primary-green" />{' '}
                        <span className="truncate text-sm text-muted-foreground">Ganho</span>
                      </Button>

                      <Button
                        variant={`${field.value === 'EXPENSE' ? 'secondary' : 'outline'}`}
                        className="flex items-center gap-2"
                        type="button"
                        onClick={() => field.onChange('EXPENSE')}
                      >
                        <TrendingDownIcon className="text-primary-red" />{' '}
                        <span className="truncate text-sm text-muted-foreground">Gasto</span>
                      </Button>

                      <Button
                        variant={`${field.value === 'INVESTMENT' ? 'secondary' : 'outline'}`}
                        className="flex items-center gap-2"
                        type="button"
                        onClick={() => field.onChange('INVESTMENT')}
                      >
                        <PiggyBankIcon className="text-primary-blue" />{' '}
                        <span className="truncate text-sm text-muted-foreground">Investimento</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="reset"
                  variant="secondary"
                  className="flex-1"
                  disabled={isCreatingTransaction}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant="default"
                className="flex-1"
                disabled={isCreatingTransaction}
              >
                {isCreatingTransaction && <Loader2Icon className="animate-spin" />}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewTransactionButton
