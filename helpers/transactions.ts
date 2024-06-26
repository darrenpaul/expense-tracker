import {
  isSameDay,
  format,
  eachMonthOfInterval,
  isThisMonth,
  differenceInCalendarDays,
  differenceInWeeks,
} from 'date-fns'
import { DATE_FORMAT } from './dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { ICategory } from '~~/types/category'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useBudgets } from '~~/stores/budgets'

interface IMergeTransactionsByProperty {
  keyProperty: string
  data: Array<ITransaction>
}
interface IAmountDate {
  amount?: number
  date: string
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
    const dateOnly = format(new Date(date), DATE_FORMAT)
    if (!merged[dateOnly]) {
      merged[dateOnly] = { amount, date }
    } else {
      merged[dateOnly].amount += amount
    }
  })

  return Object.values(merged)
}

export const mergeExpensesByCategory = (transactions: Array<ITransaction>) => {
  const merged: IMerged = { undefined: { amount: 0 } }
  transactions.forEach(({ amount, category }) => {
    const categoryName = category?.name
    if (categoryName) {
      if (!merged[categoryName]) {
        merged[categoryName] = { amount, category }
      } else {
        merged[categoryName].amount += amount
      }
    } else {
      merged.undefined.amount += amount
    }
  })

  return Object.values(merged)
}

export const totalAmountTransactions = (transactions: Array<ITransaction>) => {
  let value = 0.0
  transactions.forEach(({ amount }) => {
    value += amount
  })

  return value
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

export const fillPeriodDaysV2 = ({
  transactions,
  days,
}: {
  transactions: Array<IAmountDate>
  days: Array<Date>
}) => {
  const merged: IMerged = {}
  days.forEach((day) => {
    let transactionsForDay = transactions.find(({ date, amount }) => {
      if (isSameDay(new Date(date), day)) {
        return { date, amount }
      }
    })
    if (!transactionsForDay) {
      transactionsForDay = { date: format(day, DATE_FORMAT), amount: 0 }
    }
    merged[format(day, DATE_FORMAT)] = transactionsForDay as IAmountDate
  })
  return Object.values(merged)
}

export const balanceIncomeExpense = (transactions: Array<ITransaction>) => {
  const incomes = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
  )
  const expenses = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
  )

  const incomeAmountTotal = totalAmountTransactions(incomes)
  const expenseAmountTotal = totalAmountTransactions(expenses)

  const balance = incomeAmountTotal - expenseAmountTotal

  return { balance, income: incomeAmountTotal, expense: expenseAmountTotal }
}

interface ISpendPerPeriod {
  balance: number
  endDate: Date
}
export const spendPerDay = ({ balance, endDate }: ISpendPerPeriod) => {
  let remainingDays = differenceInCalendarDays(endDate, new Date())
  if (remainingDays === 0) remainingDays = 1

  const amount = parseFloat((balance / remainingDays).toFixed(2))
  if (amount < 0) {
    return 0.0
  }
  return amount
}

export const spendPerWeek = ({ balance, endDate }: ISpendPerPeriod) => {
  let remainingWeeks = differenceInWeeks(endDate, new Date())
  if (remainingWeeks === 0) remainingWeeks = 1
  const amount = parseFloat((balance / remainingWeeks).toFixed(2))
  if (amount < 0) {
    return 0.0
  }
  return amount
}

export const spendPerMonth = ({ balance, endDate }: ISpendPerPeriod) => {
  if (isThisMonth(endDate)) {
    return parseFloat((balance / 1).toFixed(2))
  }

  const months = eachMonthOfInterval({
    start: new Date(),
    end: new Date(endDate),
  })

  return parseFloat((balance / months.length).toFixed(2))
}

export const balance = (accountId = 'All', excluded = true) => {
  const transactionStore = useTransactions()
  const budgets = useBudgets().balanceAmountFromBudgets

  const income = transactionStore.income(accountId, excluded)
  const expense = transactionStore.expense(accountId, excluded)
  return income - expense - budgets
}
