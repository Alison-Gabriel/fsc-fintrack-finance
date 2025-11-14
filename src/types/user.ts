export interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface UserWithTokensData extends UserData {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
