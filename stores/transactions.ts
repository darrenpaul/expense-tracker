import { defineStore } from 'pinia'
import { format, isToday, setDate, subMonths } from 'date-fns'
import { useNotification } from './notification'
import { useUserSettings } from './userSettings'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import {
  createTransaction,
  deleteTransaction,
  viewTransactions,
} from '~~/endpoints/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import { TRANSACTION_COPY } from '~~/constants/copy'

export const useTransactions = defineStore({
  id: 'transactions',

  state: () => ({
    transactions: [] as Array<ITransaction>,
  }),

  getters: {
    list: (state) => state.transactions,
    expenses: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
      ),
    incomes: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
      ),
    transfers: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_TRANSFER.displayName
      ),
    income(state) {
      return (accountId = 'All', excluded = true) => {
        const pandas = state.transactions.filter(
          ({ account }) => account.includeInBalance === excluded
        )

        const incomesOnly = pandas.filter(
          ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
        )

        const accountsOnly = incomesOnly.filter(
          ({ account }) => account.id === accountId || accountId === 'All'
        )
        return totalAmountTransactions(accountsOnly) as number
      }
    },
    expense: (state) => {
      return (accountId = 'All', excluded = true) => {
        const pandas = state.transactions.filter(
          ({ account }) => account.includeInBalance === excluded
        )

        const expensesOnly = pandas.filter(
          ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
        )
        const accountsOnly = expensesOnly.filter(
          ({ account }) => account.id === accountId || accountId === 'All'
        )
        return totalAmountTransactions(accountsOnly) as number
      }
    },
    transactionsForGoal: (state) => {
      return (goalId: string) => {
        const goalTransactions = state.transactions.filter(
          ({ account }) => account.id === goalId
        )

        return totalAmountTransactions(goalTransactions) as number
      }
    },
    transactionsWithCategory: (state) => {
      return (categoryIds: Array<string>) => {
        return state.transactions.filter(({ category }) =>
          categoryIds.includes(category?.id)
        )
      }
    },
    transactionsForToday: (state) =>
      state.transactions.filter(({ date }) => isToday(new Date(date))),
  },
  actions: {
    async fetch() {
      // TODO: improve this so it has more functionality
      const monthStart = useUserSettings().monthStart
      const lastMonthDateObj = subMonths(setDate(new Date(), monthStart), 1)
      const lastMonthDateStr = format(lastMonthDateObj, 'yyyy-MM-dd 00:00')
      this.transactions = await viewTransactions({ date: lastMonthDateStr })
    },

    async handleCreateTransaction(data: INewTransaction) {
      await createTransaction(data)
      this.fetch()

      useNotification().addNotification({
        message: TRANSACTION_COPY.transactionAdded,
        type: 'success',
      })
    },

    async handleDeleteTransaction(transactionId: string) {
      await deleteTransaction(transactionId)
      this.transactions = this.transactions.filter(
        ({ id }) => id !== transactionId
      )

      useNotification().addNotification({
        message: TRANSACTION_COPY.deleted,
        type: 'warn',
      })
    },

    clear() {
      this.transactions = []
    },
  },
})
