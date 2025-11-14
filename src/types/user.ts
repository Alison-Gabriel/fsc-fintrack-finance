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

export interface UserBalanceData {
  earnings: string
  expenses: string
  investments: string
  earningsPercentage: string
  expensesPercentage: string
  investmentsPercentage: string
  balance: string
}
