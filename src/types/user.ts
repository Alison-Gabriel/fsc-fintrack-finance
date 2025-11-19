export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface UserWithTokens extends User {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export interface UserBalance {
  earnings: string
  expenses: string
  investments: string
  earningsPercentage: string
  expensesPercentage: string
  investmentsPercentage: string
  balance: string
}
