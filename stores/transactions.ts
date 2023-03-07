import { defineStore } from 'pinia'
import { useNotification } from './notification'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
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
    expensesForGoal: (state) => {
      return (goalId: string) => {
        const pandas = state.transactions.filter(
          (transaction) => transaction.goalId === goalId
        )

        return totalAmountTransactions(pandas) as number
      }
    },
  },

  actions: {
    async handleCreateTransaction(data: INewTransaction) {
      await createTransaction(data)
      this.fetch()

      useNotification().addNotification({
        message: TRANSACTION_COPY.transactionAdded,
        type: 'success',
      })
    },
    async fetch() {
      this.transactions = await viewTransactions()
    },
    clear() {
      this.transactions = []
    },
  },
})
