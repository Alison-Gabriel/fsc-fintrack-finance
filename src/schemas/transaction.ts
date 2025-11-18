import z from 'zod'

export const transactionSchema = z.object({
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

export type TransactionSchema = z.infer<typeof transactionSchema>
