import { isSameDay, format } from 'date-fns'
import { DATE_FORMAT } from './dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { ICategory } from '~~/types/category'

interface IMergeTransactionsByProperty {
  keyProperty: string
  data: Array<ITransaction>
}
interface IAmountDate {
  amount?: number
  date?: string
  category?: ICategory
}
interface IMerged {
  [prop: string]: IAmountDate
}

export const mergeTransactionsByProperty = ({
  keyProperty,
  data,
}: IMergeTransactionsByProperty) => {
  const filteredTransactions = data.filter(({ type }) => type === keyProperty)

  interface ICombinedTransaction {
    amount: number
    type: string
  }

  const combinedTransactions: ICombinedTransaction = {
    amount: 0,
    type: keyProperty,
  }
  filteredTransactions.forEach(
    ({ amount }) => (combinedTransactions.amount += amount)
  )
  return combinedTransactions
}

export const mergeTransactionsByDate = (transactions: Array<ITransaction>) => {
  const merged: IMerged = {}
  transactions.forEach(({ amount, date }) => {
    if (!merged[date]) {
      merged[date] = { amount, date }
    } else {
      merged[date].amount += amount
    }
  })

  return Object.values(merged)
}

export const mergeExpensesByCategory = (transactions: Array<ITransaction>) => {
  const merged: IMerged = {}
  transactions.forEach(({ amount, category }) => {
    const categoryName = category.name
    if (!merged[categoryName]) {
      merged[categoryName] = { amount, category }
    } else {
      merged[categoryName].amount += amount
    }
  })

  return Object.values(merged)
}

export const fillPeriodDays = ({
  transactions,
  days,
}: {
  transactions: Array<IAmountDate>
  days: Array<Date>
}) => {
  const merged: IMerged = {}

  days.forEach((day) => {
    const transactionsForDay = transactions.find(({ date, amount }) => {
      if (isSameDay(new Date(date), day)) {
        return { date, amount }
      }
    })
    merged[format(day, DATE_FORMAT)] = transactionsForDay as IAmountDate
  })
  return Object.values(merged)
}
