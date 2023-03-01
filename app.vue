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
import { useAccount } from './stores/account'
import { useTheme } from '~~/stores/theme'
import { useNotification } from '~~/stores/notification'
import { useCategories } from '~~/stores/categories'
import { Theme } from '~~/types/theme'
import { LOCAL_STORAGE_THEME_KEY } from '~~/constants/settings'
import { useUserSettings } from '~~/stores/userSettings'

const theme = useTheme()
const account = useAccount()
const categories = useCategories()
const userSettings = useUserSettings()
const notification = useNotification()

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

  if (account.authenticated) {
    categories.fetchCategories()
    userSettings.fetchUserSettings()
  }
})
</script>
