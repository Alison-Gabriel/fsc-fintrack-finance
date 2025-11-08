import { Link } from 'react-router'

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
import { Input } from '@/components/ui/input'

const SignupPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="font-bold">Crie a sua conta</CardTitle>
          <CardDescription>Insira seus dados abaixo.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input placeholder="Digite seu nome" />
          <Input placeholder="Digite seu e-mail" />
          <PasswordInput placeholder="Digite sua senha" />
          <PasswordInput placeholder="Confirme sua senha" />

          <div className="flex gap-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-xs font-medium text-muted-foreground opacity-75"
            >
              Ao clicar em “Criar conta”, você aceita{' '}
              <a href="#" className="text-primary underline underline-offset-2">
                nosso termo de uso e política de privacidade.
              </a>
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Criar conta</Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center gap-1">
        <p className="text-center opacity-50">Já possui uma conta?</p>
        <Button variant="link" className="p-0" asChild>
          <Link to="/login">Faça login.</Link>
        </Button>
      </div>
    </div>
  )
}

export default SignupPage
