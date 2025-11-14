import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'

const loginSchema = z.object({
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

type LoginSchema = z.infer<typeof loginSchema>

interface UserResponseData {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
}

interface UserWithTokensData extends UserResponseData {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const LoginPage = () => {
  const [user, setUser] = useState<UserResponseData | null>(null)

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables: LoginSchema) => {
      const user = await api.post<UserWithTokensData>('/users/login', {
        email: variables.email,
        password: variables.password,
      })
      return user.data
    },
  })

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const verifyTokens = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken && !refreshToken) return

      try {
        const user = await api.get<UserResponseData>('/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setUser(user.data)
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        console.log((error as Error).message)
      }
    }
    verifyTokens()
  }, [])

  const handleLoginSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        const accessToken = loggedUser.tokens.accessToken
        const refreshToken = loggedUser.tokens.refreshToken

        setUser(loggedUser)
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        toast.success('Login efetuado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao fazer login.')
      },
    })
  }

  if (user) {
    return <h1>Olá, {user.first_name}!</h1>
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
          <Card className="w-[450px]">
            <CardHeader className="text-center">
              <CardTitle className="font-bold">Entre na sua conta</CardTitle>
              <CardDescription>Insira seus dados abaixo.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
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
            </CardContent>

            <CardFooter>
              <Button className="w-full">Fazer login</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="flex items-center justify-center gap-1 text-sm">
        <p className="text-center opacity-50">Ainda não possui uma conta?</p>
        <Button variant="link" className="p-0" asChild>
          <Link to="/signup">Crie agora.</Link>
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
