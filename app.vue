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
import { useTheme } from '~~/stores/theme'
import { useNotification } from '~~/stores/notification'
import { Theme } from '~~/types/theme'
import { LOCAL_STORAGE_THEME_KEY } from '~~/constants/settings'

const theme = useTheme()
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
})
</script>
