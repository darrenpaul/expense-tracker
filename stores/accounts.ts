import { defineStore } from 'pinia'
import { viewAccounts } from '~~/endpoints/accounts'
import { IAccount } from '~~/types/account'

export const useAccounts = defineStore({
  id: 'accounts',

  state: () => ({
    accounts: [] as Array<IAccount>,
  }),

  getters: {},

  actions: {
    async fetchAccounts() {
      this.accounts = await viewAccounts()
    },
  },
})
