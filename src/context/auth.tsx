import { useMutation } from '@tanstack/react-query'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'

import { removeLocalStorageTokens } from '@/helpers/remove-local-storage-tokens'
import { setLocalStorageTokens } from '@/helpers/set-local-storage-tokens'
import { api } from '@/lib/axios'
import { LoginSchema } from '@/schemas/login'
import { SignupSchema } from '@/schemas/signup'
import { UserData, UserWithTokensData } from '@/types/user'
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/variables/local-storage-tokens'

interface AuthContextData {
  user: UserData | null
  isTokensBeingValidated: boolean
  login: (data: LoginSchema) => Promise<void>
  signup: (data: SignupSchema) => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isTokensBeingValidated, setIsTokensBeingValidated] = useState(true)

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

  useEffect(() => {
    const validateLocalStorageTokens = async () => {
      setIsTokensBeingValidated(true)

      try {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY
        )

        if (!accessToken && !refreshToken) return

        const user = await api.get<UserData>('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setUser(user.data)
      } catch (error) {
        setUser(null)
        removeLocalStorageTokens()
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
        toast.error(
          'Erro ao criar conta, verifique seus dados e tente novamente.'
        )
      },
    })
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
    <AuthContext.Provider
      value={{ user, isTokensBeingValidated, signup, login }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
