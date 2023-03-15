import { defineStore } from 'pinia'
import { useNotification } from './notification'
import { CATEGORY_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  viewCategories,
} from '~~/endpoints/category'
import { ICategory, INewCategory } from '~~/types/category'

export const useCategories = defineStore({
  id: 'categories',

  state: () => ({
    categories: [] as Array<ICategory>,
  }),

  getters: {
    expenseCategories: (state) =>
      state.categories.filter(
        (item) => item.transactionType === TRANSACTION_TYPE_EXPENSE.displayName
      ),
    incomeCategories: (state) =>
      state.categories.filter(
        (item) => item.transactionType === TRANSACTION_TYPE_INCOME.displayName
      ),
    transferCategories: (state) =>
      state.categories.filter(
        (item) => item.transactionType === TRANSACTION_TYPE_TRANSFER.displayName
      ),
  },

  actions: {
    async fetch() {
      this.categories = await viewCategories()
    },

    async handleCreateCategory(categoryData: INewCategory) {
      const category = await createCategory(categoryData)

      this.categories = [...this.categories, category]

      useNotification().addNotification({
        message: CATEGORY_COPY.created,
        type: 'success',
      })
    },

    async handleUpdateCategory(data: ICategory) {
      await updateCategory(data)

      this.categories = this.categories.filter(({ id }) => data.id !== id)
      this.categories = [...this.categories, data]

      useNotification().addNotification({
        message: CATEGORY_COPY.updated,
        type: 'success',
      })
    },

    async handleDeleteCategory(categoryId: string) {
      await deleteCategory(categoryId)
      this.categories = this.categories.filter(({ id }) => id !== categoryId)

      useNotification().addNotification({
        message: CATEGORY_COPY.deleted,
        type: 'warn',
      })
    },

    clear() {
      this.categories = []
    },
  },
})
