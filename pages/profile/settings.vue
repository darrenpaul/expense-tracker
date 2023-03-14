<template>
  <div>
    <div class="row between items-center my-4">
      <h2>{{ SETTINGS_COPY.settings }}</h2>
    </div>

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
