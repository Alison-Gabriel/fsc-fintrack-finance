export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface UserDataWithTokens extends UserData {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
