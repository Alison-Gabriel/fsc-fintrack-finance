import { Loader2Icon } from 'lucide-react'
import { Link, Navigate } from 'react-router'

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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/context/auth'
import { useLoginForm } from '@/forms/hooks/user'
import { LoginFormSchema } from '@/forms/schemas/user'

const LoginPage = () => {
  const { user, login, isTokensBeingValidated } = useAuthContext()
  const { form } = useLoginForm()

  const handleLogin = async (data: LoginFormSchema) => {
    await login(data)
  }

  if (isTokensBeingValidated) return null
  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
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
                      <Input {...field} className="bg-card" placeholder="Digite seu e-mail" />
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
                      <PasswordInput {...field} placeholder="Digite sua senha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                Fazer login
              </Button>
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
