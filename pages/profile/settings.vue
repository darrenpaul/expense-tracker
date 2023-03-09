<template>
  <div>
    <h1>{{ SETTINGS_COPY.settings }}</h1>

    <UserSettings />
  </div>
</template>

<script setup lang="ts">
import UserSettings from '~~/components/settings/UserSettings.vue'

import { SETTINGS_COPY } from '~~/constants/copy'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})
</script>
