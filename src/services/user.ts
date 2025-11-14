import { publicApi } from '@/lib/axios'
import { SignupSchema } from '@/schemas/signup'
import { UserWithTokensData } from '@/types/user'

interface UserServiceProps {
  signup: (data: SignupSchema) => Promise<UserWithTokensData>
}

export class UserService implements UserServiceProps {
  async signup(data: SignupSchema) {
    const { data: createdUser } = await publicApi.post<UserWithTokensData>('/users', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    })
    return createdUser
  }
}
