import {
  ExternalLinkIcon,
  Loader2Icon,
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'

import { Transaction } from '@/api/services/transaction'
import { useEditTransactionForm } from '@/forms/hooks/transaction'

import { Button } from './ui/button'
import { DatePicker } from './ui/date-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

interface EditTransactionButtonProps {
  transaction: Transaction
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { form, handleEditTransaction } = useEditTransactionForm({
    transaction,
    onSuccess: () => {
      setIsSheetOpen(false)
      toast.success('Transação editada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao editar transação, verifique os dados e tente novamente.')
    },
  })

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-lg">
          <ExternalLinkIcon className="text-muted-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-[450px]">
        <SheetHeader>
          <SheetTitle>Transação</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditTransaction)} className="space-y-4">
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

            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="reset"
                  variant="secondary"
                  className="flex-1"
                  disabled={form.formState.isSubmitting}
                >
                  Cancelar
                </Button>
              </SheetClose>

              <Button
                type="submit"
                variant="default"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default EditTransactionButton
