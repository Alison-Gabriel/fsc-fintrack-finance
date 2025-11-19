import { useMutation, useQuery } from '@tanstack/react-query'

import { UserService } from '@/api/services/user'
import { useAuthContext } from '@/context/auth'
import { LoginFormSchema } from '@/forms/schemas/user'
import { SignupFormSchema } from '@/forms/schemas/user'

interface UseGetUserBalanceProps {
  from?: string | null
  to?: string | null
}

interface GetUserBalanceQueryKeyProps extends UseGetUserBalanceProps {
  userId: string | undefined
}

export const getUserBalanceQueryKey = ({ from, to, userId }: GetUserBalanceQueryKeyProps) => {
  if (!from || !to) {
    return ['balance', userId]
  }

  return ['balance', userId, from, to]
}

export const useGetUserBalance = ({ from, to }: UseGetUserBalanceProps) => {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: getUserBalanceQueryKey({ from, to, userId: user?.id }),
    queryFn: async () => {
      const userService = new UserService()
      const { balance } = await userService.getBalance({ from, to })

      return balance
    },
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(from) && Boolean(to) && Boolean(user?.id),
  })
}

export const getSignupMutationKey = () => ['signup']

export const useSignup = () => {
  return useMutation({
    mutationKey: getSignupMutationKey(),
    mutationFn: async (variables: SignupFormSchema) => {
      const userService = new UserService()
      return userService.signup(variables)
    },
  })
}

export const getLoginMutationKey = () => ['login']

export const useLogin = () => {
  return useMutation({
    mutationKey: getLoginMutationKey(),
    mutationFn: async (variables: LoginFormSchema) => {
      const userService = new UserService()
      return userService.login(variables)
    },
  })
}
