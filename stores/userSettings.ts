import { defineStore } from 'pinia'
import { useAccount } from './account'
import { viewUserSettings } from '~~/endpoints/userSettings'

export const useUserSettings = defineStore({
  id: 'settings',

  state: () => ({
    id: '',
    currency: '',
  }),

  getters: {
    settingsId: (state) => state.id,
    defaultCurrency: (state) => state.currency,
  },

  actions: {
    async fetchUserSettings() {
      const account = useAccount()
      const userId = account.userId
      const userSettings = await viewUserSettings(userId)

      this.id = userSettings.id
      this.currency = userSettings.currency
    },
  },
})
