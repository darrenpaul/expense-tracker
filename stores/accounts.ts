import { defineStore } from 'pinia'
import { useNotification } from './notification'
import {
  createAccount,
  deleteAccount,
  viewAccounts,
} from '~~/endpoints/accounts'
import { IAccount, INewAccount } from '~~/types/account'
import { COMMON_COPY } from '~~/constants/copy'
import COPY from '~~/constants/copy/account'

export const useAccounts = defineStore({
  id: 'accounts',

  state: () => ({
    accounts: [] as Array<IAccount>,
  }),

  getters: {},

  actions: {
    async handleCreateAccount(data: INewAccount) {
      return await createAccount(data)
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
    clear() {
      this.accounts = []
    },
  },
})
