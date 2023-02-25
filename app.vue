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
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~~/stores/theme'
import { useCategories } from '~~/stores/categories'
import { Theme } from '~~/types/theme'
import { LOCAL_STORAGE_THEME_KEY } from '~~/constants/settings'

const theme = useTheme()
const categories = useCategories()

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

  categories.fetchCategories()
})
</script>
