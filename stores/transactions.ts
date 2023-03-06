import { defineStore } from 'pinia'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { viewTransactions } from '~~/endpoints/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { ITransaction } from '~~/types/transaction'

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
  },

  actions: {
    async fetchTransactions() {
      this.transactions = await viewTransactions()
    },
    clear() {
      this.transactions = []
    },
  },
})
