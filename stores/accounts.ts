import { defineStore } from 'pinia'
import { useNotification } from './notification'
import {
  createAccount,
  deleteAccount,
  updateAccount,
  viewAccounts,
} from '~~/endpoints/accounts'
import { IAccount, INewAccount } from '~~/types/account'
import COPY from '~~/constants/copy/account'
import { balance } from '~~/helpers/transactions'

export const useAccounts = defineStore({
  id: 'accounts',

  state: () => ({
    accounts: [] as Array<IAccount>,
  }),

  getters: {
    accountsInBalance: (state) => {
      const accountsIncludedInBalance = state.accounts.filter(
        ({ includeInBalance }) => includeInBalance === true
      )
      return accountsIncludedInBalance.map(({ id }) => id)
    },
  },

  actions: {
    async handleCreateAccount(data: INewAccount) {
      return await createAccount(data)
    },

    async handleUpdateAccount(data: IAccount) {
      await updateAccount(data)
      this.fetch()
    },

    async handleDeleteAccount(accountId: string) {
      await deleteAccount(accountId)
      this.accounts = this.accounts.filter(({ id }) => id !== accountId)

      useNotification().addNotification({
        message: COPY.deleted,
        type: 'warn',
      })
    },

    async fetch() {
      this.accounts = await viewAccounts()
    },

    async updateAccountBalance(accountId: string) {
      const account = this.accounts.find(
        (account: IAccount) => account.id === accountId
      )
      if (account) {
        account.balance = balance(account.id, false)

        await this.handleUpdateAccount(account)
      }
    },

    clear() {
      this.accounts = []
    },
  },
})
