import { defineStore } from 'pinia'
import {
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  setDate,
  subMonths,
} from 'date-fns'
import { useNotification } from './notification'
import { useAccounts } from './accounts'
import { useUserSettings } from './userSettings'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  viewTransactions,
} from '~~/endpoints/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import COPY from '~~/constants/copy/transactions'
import { average, sumArrayNumbers } from '~~/helpers/maths'

export const useTransactions = defineStore({
  id: 'transactions',

  state: () => ({
    transactions: [] as Array<ITransaction>,
  }),

  getters: {
    list: (state) => state.transactions,
    expenses: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
      ),
    incomes: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
      ),
    transfers: (state) =>
      state.transactions.filter(
        ({ type }) => type === TRANSACTION_TYPE_TRANSFER.displayName
      ),
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
    incomeV2(state) {
      return (accountIds: Array<string>) => {
        let accountTransactions = this.incomes
        if (accountIds.length > 0) {
          accountTransactions = accountTransactions.filter(
            ({ account }) => accountIds.includes(account.id) === true
          )
        }

        const transactionAmounts = accountTransactions.map(
          ({ amount }) => amount
        )

        return sumArrayNumbers(transactionAmounts)
      }
    },
    expenseV2(state) {
      return (accountIds: Array<string>) => {
        let accountTransactions = this.expenses
        if (accountIds.length > 0) {
          accountTransactions = accountTransactions.filter(
            ({ account }) => accountIds.includes(account.id) === true
          )
        }

        const transactionAmounts = accountTransactions.map(
          ({ amount }) => amount
        )

        return sumArrayNumbers(transactionAmounts)
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
    transactionsForGoal: (state) => {
      return (goalId: string) => {
        const goalTransactions = state.transactions.filter(
          ({ account }) => account.id === goalId
        )

        return totalAmountTransactions(goalTransactions) as number
      }
    },
    transactionsWithCategory: (state) => {
      return (categoryIds: Array<string>) => {
        return state.transactions.filter(({ category }) =>
          categoryIds.includes(category?.id)
        )
      }
    },
    transactionsForToday: (state) =>
      state.transactions.filter(({ date }) => isToday(new Date(date))),
    balanceIncome() {
      return () => this.incomeV2(useAccounts().accountsInBalance)
    },
    balanceExpense() {
      return () => this.expenseV2(useAccounts().accountsInBalance)
    },
    balance() {
      return () => this.balanceIncome() - this.balanceExpense()
    },
    previousMonthAverage(state) {
      return () => {
        const userMonthStart = useUserSettings().monthStart
        const pastMonthStartDate = setDate(
          subMonths(new Date(), 2),
          userMonthStart
        )
        const pastMonthEndDate = setDate(
          subMonths(new Date(), 1),
          userMonthStart
        )

        const transactionsForPeriod = state.transactions.filter(
          ({ date }) =>
            isSameDay(new Date(date), pastMonthStartDate) ||
            isSameDay(new Date(date), pastMonthEndDate) ||
            (isAfter(new Date(date), pastMonthStartDate) &&
              isBefore(new Date(date), pastMonthEndDate))
        )

        const daysBetween = differenceInCalendarDays(
          pastMonthEndDate,
          pastMonthStartDate
        )

        const transactionAmounts = transactionsForPeriod.map(
          ({ amount }) => amount
        )

        const filledAmounts = new Array(
          daysBetween - transactionAmounts.length
        ).fill(0)

        const averageValue = average({
          values: [...transactionAmounts, ...filledAmounts],
        })

        return parseFloat(averageValue.toFixed(2))
      }
    },
  },

  actions: {
    async fetch() {
      this.transactions = await viewTransactions()
    },

    async handleCreateTransaction(data: INewTransaction) {
      await createTransaction(data)

      this.fetch()

      useNotification().addNotification({
        message: COPY.created,
        type: 'success',
      })
    },

    async handleUpdateTransaction(data: ITransaction) {
      await updateTransaction(data)

      this.fetch()

      useNotification().addNotification({
        message: COPY.updated,
        type: 'success',
      })
    },

    async handleDeleteTransaction(transactionId: string) {
      await deleteTransaction(transactionId)

      this.transactions = this.transactions.filter(
        (transaction) => transaction.id !== transactionId
      )

      useNotification().addNotification({
        message: COPY.deleted,
        type: 'warn',
      })
    },

    clear() {
      this.transactions = []
    },
  },
})
