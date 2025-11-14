import { protectedApi, publicApi } from '@/lib/axios'
import { UserResponse, UserResponseWithTokens } from '@/types/api'
import { UserData, UserDataWithTokens } from '@/types/user'

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
  signup: (data: SignupInputData) => Promise<UserDataWithTokens>
  login: (data: LoginInputData) => Promise<UserDataWithTokens>
  me: () => Promise<UserData>
}

export class UserService implements UserServiceProps {
  async signup({ firstName, lastName, email, password }: SignupInputData) {
    const { data: createdUser } = await publicApi.post<UserResponseWithTokens>('/users', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    })

    return {
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      tokens: createdUser.tokens,
    }
  }

  async login({ email, password }: LoginInputData) {
    const { data: loggedUser } = await publicApi.post<UserResponseWithTokens>('/users/login', {
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
}
