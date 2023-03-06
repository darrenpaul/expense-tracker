import { defineStore } from 'pinia'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { viewCategories } from '~~/endpoints/category'
import { ICategory } from '~~/types/category'

export const useCategories = defineStore({
  id: 'categories',

  state: () => ({
    categories: [] as Array<ICategory>,
  }),

  getters: {
    categoryList: (state) => state.categories,
    expenseCategories: (state) =>
      state.categories.filter(
        (item) => item.transactionType === TRANSACTION_TYPE_EXPENSE.displayName
      ),
    incomeCategories: (state) =>
      state.categories.filter(
        (item) => item.transactionType === TRANSACTION_TYPE_INCOME.displayName
      ),
  },

  actions: {
    async fetchCategories() {
      this.categories = await viewCategories()
    },
  },
})
