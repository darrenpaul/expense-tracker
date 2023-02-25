import { defineStore } from 'pinia'
import { viewCategories } from '~~/endpoints/category'
import { ICategory } from '~~/types/category'

export const useCategories = defineStore({
  id: 'categories',

  state: () => ({
    categories: [] as Array<ICategory>,
  }),

  getters: {
    categoryList: (state) => state.categories,
  },

  actions: {
    async fetchCategories() {
      this.categories = await viewCategories()
    },
  },
})
