export interface INewBudget {
  userId: string
  categoryIds: Array<string>
  name: string
  amount: number
  startDate: string
  endDate: string
  note: string
}

export interface IBudget {
  id: string
  categoryIds: Array<string>
  name: string
  amount: number
  startDate: string
  endDate: string
  note: string
}
