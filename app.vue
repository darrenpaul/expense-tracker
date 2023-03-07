<template>
  <div
    :class="[
      theme.darkMode ? 'theme-dark' : 'theme-light',
      'bg-theme-background',
    ]"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationToaster :notification="notification.notification" />
  </div>
</template>

<script setup lang="ts">
import { useProfile } from './stores/profile'
import { useTheme } from '~~/stores/theme'
import { useNotification } from '~~/stores/notification'
import { useCategories } from '~~/stores/categories'
import { Theme } from '~~/types/theme'
import { LOCAL_STORAGE_THEME_KEY } from '~~/constants/settings'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import { useAccounts } from '~~/stores/accounts'
import { useGoals } from '~~/stores/goals'

const theme = useTheme()
const profile = useProfile()
const categories = useCategories()
const userSettings = useUserSettings()
const notification = useNotification()
const accountStore = useAccounts()
const transactionsStore = useTransactions()
const goalStore = useGoals()

onMounted(() => {
  const isDarkModePreferred = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const themeFromLocalStorage = localStorage.getItem(
    LOCAL_STORAGE_THEME_KEY
  ) as Theme

  if (themeFromLocalStorage) {
    theme.setTheme(themeFromLocalStorage)
  } else {
    theme.setTheme(isDarkModePreferred ? 'dark' : 'light')
  }

  if (profile.authenticated) {
    categories.fetchCategories()
    userSettings.fetchUserSettings()
    accountStore.fetchAccounts()
    transactionsStore.fetch()
    goalStore.fetch()
  }
})
</script>
