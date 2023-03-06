import { defineStore } from 'pinia'
import { useProfile } from './profile'
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
      const profile = useProfile()
      const userId = profile.userId
      const userSettings = await viewUserSettings(userId)

      this.id = userSettings.id
      this.currency = userSettings.currency
    },
  },
})
