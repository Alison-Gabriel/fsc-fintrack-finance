import { protectedApi, publicApi } from '@/lib/axios'
import { UserData, UserWithTokensData } from '@/types/user'

interface SignupInputData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface LoginInputData {
  email: string
  password: string
}

interface UserServiceProps {
  signup: ({
    firstName,
    lastName,
    email,
    password,
  }: SignupInputData) => Promise<UserWithTokensData>
  login: ({ email, password }: LoginInputData) => Promise<UserData>
  me: () => Promise<UserData>
}

export class UserService implements UserServiceProps {
  async signup({ firstName, lastName, email, password }: SignupInputData) {
    const response = await publicApi.post<UserWithTokensData>('/users', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    })
    return response.data
  }

  async login({ email, password }: LoginInputData) {
    const response = await publicApi.post<UserWithTokensData>('/users/login', {
      email,
      password,
    })
    return response.data
  }

  async me() {
    const response = await protectedApi.get<UserData>('/users/me')
    return response.data
  }
}
