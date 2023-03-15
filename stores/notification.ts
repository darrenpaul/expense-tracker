import { defineStore } from 'pinia'

export const useNotification = defineStore({
  id: 'notification',

  state: () => ({
    notification: {},
  }),

  actions: {
    addNotification(data) {
      this.notification = data
    },
    clear() {
      this.notification = {}
    },
  },
})
