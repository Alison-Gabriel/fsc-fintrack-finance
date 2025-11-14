export interface UserResponse {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface UserResponseWithTokens extends UserResponse {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
