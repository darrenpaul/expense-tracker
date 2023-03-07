import { defineStore } from 'pinia'
import { useNotification } from './notification'
import {
  createGoal,
  viewGoals,
  updateGoal,
  deleteGoal,
} from '~~/endpoints/goals'
import { IGoal, INewGoal } from '~~/types/goal'
import { COMMON_COPY } from '~~/constants/copy'

export const useGoals = defineStore({
  id: 'goals',

  state: () => ({
    goals: [] as Array<IGoal>,
  }),

  getters: {},

  actions: {
    async handleCreateGoal(data: INewGoal) {
      const goal = await createGoal(data)
      this.goals = [...this.goals, goal]

      useNotification().addNotification({
        message: COMMON_COPY.created,
        type: 'success',
      })
    },
    async handleUpdateGoal(data: IGoal) {
      await updateGoal(data)
      this.fetch()

      useNotification().addNotification({
        message: COMMON_COPY.updated,
        type: 'success',
      })
    },
    async handleDeleteGoal(goalId: string) {
      await deleteGoal(goalId)
      this.goals = this.goals.filter(({ id }) => id === goalId)

      useNotification().addNotification({
        message: COMMON_COPY.deleted,
        type: 'warn',
      })
    },
    async fetch() {
      this.goals = await viewGoals()
    },
    clear() {
      this.goals = []
    },
  },
})
