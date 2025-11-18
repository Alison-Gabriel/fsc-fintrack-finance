import z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'O e-mail digitado é inválido.',
    })
    .min(1, {
      message: 'O e-mail é obrigatório.',
    }),
  password: z.string().trim().min(6, {
    message: 'A senha deve ter no mínimo 6 caracteres.',
  }),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, {
      message: 'O nome é obrigatório.',
    }),
    lastName: z.string().trim().min(1, {
      message: 'O sobrenome é obrigatório',
    }),
    email: z
      .string()
      .email({
        message: 'O e-mail digitado é inválido.',
      })
      .min(1, {
        message: 'O e-mail é obrigatório.',
      }),
    password: z.string().trim().min(6, {
      message: 'A senha deve ter no mínimo 6 caracteres.',
    }),
    passwordConfirmation: z.string().trim().min(6, {
      message: 'A confirmação da senha é obrigatória.',
    }),
    terms: z.boolean().refine((fieldValue) => fieldValue === true, {
      message: 'Você precisa aceitar os termos.',
    }),
  })
  .refine((fields) => fields.password === fields.passwordConfirmation, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirmation'],
  })

export type SignupSchema = z.infer<typeof signupSchema>
