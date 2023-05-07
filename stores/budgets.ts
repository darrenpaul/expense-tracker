import { defineStore } from 'pinia'
import { isWithinInterval } from 'date-fns'
import { useNotification } from './notification'
import { useTransactions } from './transactions'
import { COMMON_COPY } from '~~/constants/copy'
import { IBudget, INewBudget } from '~~/types/budget'
import {
  createBudget,
  deleteBudget,
  updateBudget,
  viewBudgets,
} from '~~/endpoints/budgets'
import transactions from '~~/constants/copy/transactions'
import { sumArrayNumbers } from '~~/helpers/maths'

export const useBudgets = defineStore({
  id: 'budgets',

  state: () => ({
    budgets: [] as Array<IBudget>,
  }),

  getters: {
    balanceAmountFromBudgets: (state) => {
      const apples = state.budgets.map((budget) => {
        if (budget.adjustBalance === false) return 0
        const budgetAmount = budget.amount
        const budgetCategories = budget.categoryIds
        const budgetStartDate = new Date(budget.startDate)
        const budgetEndDate = new Date(budget.endDate)

        const transactionsInPeriod = useTransactions().transactions.filter(
          (transaction) =>
            isWithinInterval(new Date(transaction.date), {
              start: budgetStartDate,
              end: budgetEndDate,
            })
        )

        const transactionsForBudget = transactionsInPeriod.filter(
          (transactions) => budgetCategories.includes(transactions.category.id)
        )

        const amounts = transactionsForBudget.map(({ amount }) => amount)
        const transactionTotal = sumArrayNumbers(amounts)
        if (transactionTotal > budgetAmount) return 0
        return budgetAmount - transactionTotal
      })

      return sumArrayNumbers(apples)
    },
  },

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
