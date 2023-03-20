import { defineStore } from 'pinia'
import { useNotification } from './notification'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import { createTransaction, viewTransactions } from '~~/endpoints/transaction'
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
  },
  actions: {
    async fetch() {
      this.transactions = await viewTransactions()
    },

    async handleCreateTransaction(data: INewTransaction) {
      await createTransaction(data)
      this.fetch()

      useNotification().addNotification({
        message: TRANSACTION_COPY.transactionAdded,
        type: 'success',
      })
    },

    clear() {
      this.transactions = []
    },
  },
})
