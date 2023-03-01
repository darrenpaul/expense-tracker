import { defineStore } from 'pinia'
import { ICategory } from '~~/types/category'

export const useNotification = defineStore({
  id: 'notification',

  state: () => ({
    notification: {},
  }),

  actions: {
    addNotification(data) {
      this.notification = data
    },
  },
})
