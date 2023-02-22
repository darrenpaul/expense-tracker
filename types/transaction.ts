export interface INewTransaction {
  userId: string
  type: string
  note: string
  amount: string
  date: string
}

export interface ITransaction {
  id: string
  type: string
  userId: string
  note: string
  amount: string
  date: string
}
