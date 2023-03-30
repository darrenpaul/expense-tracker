import { defineStore } from 'pinia'
import { useProfile } from './profile'
import { viewUserSettings } from '~~/endpoints/userSettings'
import { SIDE_PANEL_EXPANDED_COOKIE } from '~~/constants/settings'

const getSidePanelExpandStateCookie = (value) => {
  if (value === 'true' || value === true) return true
  return false
}

export const useUserSettings = defineStore({
  id: 'settings',

  state: () => ({
    id: '',
    currency: '',
    monthStart: 1,
    sidePanelExpanded: getSidePanelExpandStateCookie(
      useCookie(SIDE_PANEL_EXPANDED_COOKIE).value
    ),
  }),

  getters: {
    settingsId: (state) => state.id,
  },

  actions: {
    async fetch() {
      const profile = useProfile()
      const userId = profile.userId
      const userSettings = await viewUserSettings(userId)

      this.id = userSettings.id
      this.currency = userSettings.currency
      this.monthStart = userSettings.monthStart || 1
    },
    saveSidePanelState(expandedState: Boolean) {
      useCookie(SIDE_PANEL_EXPANDED_COOKIE).value = expandedState.toString()
      this.sidePanelExpanded = getSidePanelExpandStateCookie(expandedState)
    },

    clear() {
      this.id = ''
      this.currency = ''
    },
  },
})
