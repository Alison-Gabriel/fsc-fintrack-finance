import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import PasswordInput from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const signupSchema = z.object({
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

type SignupSchema = z.infer<typeof signupSchema>

const SignupPage = () => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      terms: false,
    },
  })

  const handleSignupSubmit = (data: SignupSchema) => {
    console.log(data)
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignupSubmit)}>
          <Card className="w-[450px]">
            <CardHeader className="text-center">
              <CardTitle className="font-bold">Crie a sua conta</CardTitle>
              <CardDescription>Insira seus dados abaixo.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-card"
                        placeholder="Digite seu nome"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-card"
                        placeholder="Digite seu sobrenome"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-card"
                        placeholder="Digite seu e-mail"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Digite sua senha"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirme sua senha"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={clsx({
                            'border-destructive': form.formState.errors.terms,
                          })}
                        />
                      </FormControl>

                      <FormLabel className="text-xs leading-none text-muted-foreground opacity-75">
                        Ao clicar em “Criar conta”, você aceita{' '}
                        <a href="#" className="text-primary underline">
                          nosso termo de uso e política de privacidade.
                        </a>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button className="w-full">Criar conta</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="flex items-center justify-center gap-1 text-sm">
        <p className="text-center opacity-50">Já possui uma conta?</p>
        <Button variant="link" className="p-0" asChild>
          <Link to="/login">Faça login.</Link>
        </Button>
      </div>
    </div>
  )
}

export default SignupPage
