import { defineStore } from 'pinia'
import { useNotification } from './notification'
import { useAccounts } from './accounts'
import { useProfile } from './profile'
import {
  createGoal,
  viewGoals,
  updateGoal,
  deleteGoal,
} from '~~/endpoints/goals'
import { IGoal, INewGoal } from '~~/types/goal'
import { COMMON_COPY } from '~~/constants/copy'
import { INewAccount } from '~~/types/account'
export const useGoals = defineStore({
  id: 'goals',

  state: () => ({
    goals: [] as Array<IGoal>,
  }),

  getters: {},

  actions: {
    async handleCreateGoal(data: INewGoal) {
      const { name } = data
      const goalName = `${name} (Goal)`

      const accountData: INewAccount = {
        userId: useProfile().userId,
        name: goalName,
        includeInBalance: false,
      }

      const accountRecord = await useAccounts().handleCreateAccount(accountData)

      const goal = await createGoal({ ...data, accountId: accountRecord.id })
      this.goals = [...this.goals, goal]

      useAccounts().fetchAccounts()

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
      this.goals = this.goals.filter(({ id }) => id !== goalId)

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
