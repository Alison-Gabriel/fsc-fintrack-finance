import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useLogin, useSignup } from '@/api/hooks/user'
import { UserService } from '@/api/services/user'
import { LoginSchema } from '@/forms/schemas/login'
import { SignupSchema } from '@/forms/schemas/signup'
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
  login: (data: LoginSchema) => Promise<void>
  logout: () => void
  signup: (data: SignupSchema) => Promise<void>
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

  const signup = async (data: SignupSchema) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        setUser(createdUser as UserData)
        setLocalStorageTokens(createdUser.tokens)

        toast.success('Conta criada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao criar conta, verifique seus dados e tente novamente.')
      },
    })
  }

  const logout = async () => {
    setUser(null)
    removeLocalStorageTokens()
  }

  const login = async (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        setUser(loggedUser as UserData)
        setLocalStorageTokens(loggedUser.tokens)

        toast.success('Login efetuado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao fazer login.')
      },
    })
  }

  return (
    <AuthContext.Provider value={{ user, isTokensBeingValidated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
