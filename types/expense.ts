export interface INewExpense {
  userId: string
  note: string
  amount: string
  date: string
}

export interface IExpense {
  id: string
  userId: string
  note: string
  amount: string
  date: string
}
