<template>
  <div>
    <h1>{{ SETTINGS_COPY.settings }}</h1>
    <Categories />
    <UserSettings />
  </div>
</template>

<script setup lang="ts">
import UserSettings from '~~/components/settings/UserSettings.vue'
import Categories from '~~/components/settings/Categories.vue'

import { SETTINGS_COPY } from '~~/constants/copy'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
