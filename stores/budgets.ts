import { defineStore } from 'pinia'
import { useNotification } from './notification'
import { COMMON_COPY } from '~~/constants/copy'
import { IBudget, INewBudget } from '~~/types/budget'
import {
  createBudget,
  deleteBudget,
  updateBudget,
  viewBudgets,
} from '~~/endpoints/budgets'

export const useBudgets = defineStore({
  id: 'budgets',

  state: () => ({
    budgets: [] as Array<IBudget>,
  }),

  getters: {},

  actions: {
    async handleCreateBudget(data: INewBudget) {
      const budget = await createBudget(data)
      this.budgets = [...this.budgets, budget]

      useNotification().addNotification({
        message: COMMON_COPY.created,
        type: 'success',
      })
    },
    async handleUpdateBudget(data: IBudget) {
      await updateBudget(data)
      this.fetch()

      useNotification().addNotification({
        message: COMMON_COPY.updated,
        type: 'success',
      })
    },
    async handleDeleteBudget(budgetId: string) {
      await deleteBudget(budgetId)
      this.budgets = this.budgets.filter(({ id }) => id !== budgetId)

      useNotification().addNotification({
        message: COMMON_COPY.deleted,
        type: 'warn',
      })
    },
    async fetch() {
      this.budgets = await viewBudgets()
    },
    clear() {
      this.budgets = []
    },
  },
})
