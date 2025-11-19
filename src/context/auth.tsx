import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useLogin, useSignup } from '@/api/hooks/user'
import { UserService } from '@/api/services/user'
import { LoginFormSchema } from '@/forms/schemas/user'
import { SignupFormSchema } from '@/forms/schemas/user'
import { removeLocalStorageTokens } from '@/helpers/remove-local-storage-tokens'
import { setLocalStorageTokens } from '@/helpers/set-local-storage-tokens'
import { UserData } from '@/types/user'
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/variables/local-storage-tokens'

interface AuthContextData {
  user: UserData | null
  isTokensBeingValidated: boolean
  login: (data: LoginFormSchema) => Promise<void>
  logout: () => void
  signup: (data: SignupFormSchema) => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isTokensBeingValidated, setIsTokensBeingValidated] = useState(true)

  const signupMutation = useSignup()
  const loginMutation = useLogin()

  useEffect(() => {
    const validateLocalStorageTokens = async () => {
      setIsTokensBeingValidated(true)

      try {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
        const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY)

        if (!accessToken && !refreshToken) return

        const userService = new UserService()
        const user = await userService.me()

        setUser(user)
      } catch (error) {
        setUser(null)
        console.log((error as Error).message)
      } finally {
        setIsTokensBeingValidated(false)
      }
    }

    validateLocalStorageTokens()
  }, [])

  const signup = async (data: SignupFormSchema) => {
    try {
      const { createdUser } = await signupMutation.mutateAsync(data)

      setUser(createdUser as UserData)
      setLocalStorageTokens(createdUser.tokens)

      toast.success('Conta criada com sucesso!')
    } catch (error) {
      console.error((error as Error).message)

      toast.error('Erro ao criar conta, verifique seus dados e tente novamente.')
    }
  }

  const logout = () => {
    setUser(null)
    removeLocalStorageTokens()
  }

  const login = async (data: LoginFormSchema) => {
    try {
      const loggedUser = await loginMutation.mutateAsync(data)

      setUser(loggedUser as UserData)
      setLocalStorageTokens(loggedUser.tokens)

      toast.success('Login feito com sucesso!')
    } catch (error) {
      console.error((error as Error).message)

      toast.error('Erro ao fazer login, verifique seus dados e tente novamente.')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isTokensBeingValidated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
