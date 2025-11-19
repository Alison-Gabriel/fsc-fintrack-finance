import { protectedApi, publicApi } from '@/lib/axios'
import { UserResponse, UserWithTokensResponse } from '@/types/api'
import { User, UserBalance, UserWithTokens } from '@/types/user'

interface SignupInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface SignupOutput {
  createdUser: UserWithTokens
}

interface LoginInput {
  email: string
  password: string
}

interface LoginOutput {
  loggedUser: UserWithTokens
}

interface MeOutput {
  me: User
}

interface GetBalanceInput {
  from?: string | null
  to?: string | null
}

interface GetBalanceOutput {
  balance: UserBalance
}

interface UserServiceProps {
  signup: (input: SignupInput) => Promise<SignupOutput>
  login: (input: LoginInput) => Promise<LoginOutput>
  me: () => Promise<MeOutput>
  getBalance: (input: GetBalanceInput) => Promise<GetBalanceOutput>
}

export class UserService implements UserServiceProps {
  async signup(input: SignupInput) {
    const { firstName, lastName, email, password } = input

    const { data } = await publicApi.post<UserWithTokensResponse>('/users', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    })

    return {
      createdUser: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        tokens: data.tokens,
      },
    }
  }

  async login(input: LoginInput) {
    const { email, password } = input

    const { data } = await publicApi.post<UserWithTokensResponse>('/users/login', {
      email,
      password,
    })

    return {
      loggedUser: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        tokens: data.tokens,
      },
    }
  }

  async me() {
    const { data } = await protectedApi.get<UserResponse>('/users/me')

    return {
      me: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      },
    }
  }

  async getBalance(input: GetBalanceInput) {
    const queryParams = new URLSearchParams()

    const { from, to } = input

    queryParams.set('from', String(from))
    queryParams.set('to', String(to))

    const { data } = await protectedApi.get<UserBalance>(
      `/users/me/balance?${queryParams.toString()}`
    )

    return {
      balance: {
        balance: data.balance,
        earnings: data.earnings,
        earningsPercentage: data.earningsPercentage,
        expenses: data.expenses,
        expensesPercentage: data.expensesPercentage,
        investments: data.investments,
        investmentsPercentage: data.investmentsPercentage,
      },
    }
  }
}
