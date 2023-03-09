export interface INewGoal {
  userId: string
  accountId: string
  name: string
  amount: number
  date: string
  note: string
}

export interface IGoal {
  id: string
  accountId: string
  name: string
  amount: number
  date: string
  note: string
}
