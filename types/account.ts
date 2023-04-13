export interface INewAccount {
  userId: string
  name: string
  includeInBalance: boolean
  balance: number
}

export interface IAccount {
  id: string
  name: string
  includeInBalance: boolean
  balance: number
}
