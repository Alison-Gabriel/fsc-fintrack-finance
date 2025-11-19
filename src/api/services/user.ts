import { protectedApi, publicApi } from '@/lib/axios'
import { UserResponse, UserWithTokensResponse } from '@/types/api'
import { UserBalanceData, UserData, UserDataWithTokens } from '@/types/user'

interface SignupInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface SignupOutput {
  createdUser: UserDataWithTokens
}

interface LoginInputData {
  email: string
  password: string
}

interface GetBalanceInputData {
  from?: string | null
  to?: string | null
}

interface UserServiceProps {
  signup: (input: SignupInput) => Promise<SignupOutput>
  login: (data: LoginInputData) => Promise<UserDataWithTokens>
  getBalance: (data: GetBalanceInputData) => Promise<UserBalanceData>
  me: () => Promise<UserData>
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

  async login({ email, password }: LoginInputData) {
    const { data: loggedUser } = await publicApi.post<UserWithTokensResponse>('/users/login', {
      email,
      password,
    })

    return {
      id: loggedUser.id,
      firstName: loggedUser.first_name,
      lastName: loggedUser.last_name,
      email: loggedUser.email,
      tokens: loggedUser.tokens,
    }
  }

  async me() {
    const { data: user } = await protectedApi.get<UserResponse>('/users/me')

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    }
  }

  async getBalance({ from, to }: GetBalanceInputData) {
    const queryParams = new URLSearchParams()

    queryParams.set('from', String(from))
    queryParams.set('to', String(to))

    const { data: balance } = await protectedApi.get<UserBalanceData>(
      `/users/me/balance?${queryParams.toString()}`
    )
    return balance
  }
}
