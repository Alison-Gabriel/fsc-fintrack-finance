import { useMutation } from '@tanstack/react-query'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import { SignupSchema } from '@/schemas/signup'
import { UserData, UserWithTokensData } from '@/types/user'

interface AuthContextData {
  user: UserData | null
  login: () => Promise<void>
  signup: (data: SignupSchema) => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)

  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables: SignupSchema) => {
      const { data: createdUser } = await api.post<UserWithTokensData>(
        '/users',
        {
          first_name: variables.firstName,
          last_name: variables.lastName,
          email: variables.email,
          password: variables.password,
        }
      )
      return createdUser
    },
  })

  useEffect(() => {
    const validateLocalStorageTokens = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken && !refreshToken) return

      try {
        const user = await api.get<UserData>('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setUser(user.data)
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        console.log((error as Error).message)
      }
    }
    validateLocalStorageTokens()
  }, [])

  const signup = async (data: SignupSchema) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        const accessToken = createdUser.tokens.accessToken
        const refreshToken = createdUser.tokens.refreshToken

        setUser(createdUser as UserData)

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        toast.success('Conta criada com sucesso!')
      },
      onError: () => {
        toast.error(
          'Erro ao criar conta, verifique seus dados e tente novamente.'
        )
      },
    })
  }

  const login = async () => {}

  return (
    <AuthContext.Provider value={{ user, signup, login }}>
      {children}
    </AuthContext.Provider>
  )
}
