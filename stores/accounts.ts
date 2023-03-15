import { defineStore } from 'pinia'
import { useNotification } from './notification'
import { createAccount, viewAccounts } from '~~/endpoints/accounts'
import { IAccount, INewAccount } from '~~/types/account'
import { COMMON_COPY } from '~~/constants/copy'

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
    async fetch() {
      this.accounts = await viewAccounts()
    },
    clear() {
      this.accounts = []
    },
  },
})
