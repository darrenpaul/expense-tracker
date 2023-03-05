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

    incomes: (state) => {
      const incomesOnly = state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
      )
      return totalAmountTransactions(incomesOnly) as number
    },
    expenses: (state) => {
      const expensesOnly = state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
      )
      return totalAmountTransactions(expensesOnly) as number
    },

    balance(): number {
      return this.incomes - this.expenses
    },
  },

  actions: {
    async fetchTransactions() {
      this.transactions = await viewTransactions()
    },
  },
})
