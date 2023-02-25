import { ICategory } from './category'

export interface INewTransaction {
  userId: string
  type: string
  name: string
  note: string
  categoryId: string
  amount: number
  currency: string
  date: string
}

export interface ITransaction {
  id: string
  type: string
  userId: string
  name: string
  note: string
  category: ICategory
  amount: number
  currency: string
  date: string
}
