import { IAccount } from './account'
import { ICategory } from './category'

export interface INewTransaction {
  userId: string
  accountId: string
  goalId?: string
  type: string
  name: string
  note: string
  categoryId?: string
  amount: number
  date: string
}

export interface ITransaction {
  id: string
  userId: string
  accountId: string
  account: IAccount
  type: string
  name: string
  note: string
  categoryId?: string
  category: ICategory
  amount: number
  date: string
}
