import z from 'zod'

export const loginFormSchema = z.object({
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

export type LoginFormSchema = z.infer<typeof loginFormSchema>

export const signupFormSchema = z
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

export type SignupFormSchema = z.infer<typeof signupFormSchema>
