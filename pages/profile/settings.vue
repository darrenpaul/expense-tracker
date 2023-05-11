<template>
  <div>
    <div class="row between items-center my-4">
      <h2>{{ SETTINGS_COPY.settings }}</h2>
    </div>

    <UserSettings />

    <button class="button" @click="handleDeleteUserAccount">Delete</button>
  </div>
</template>

<script setup lang="ts">
import UserSettings from '~~/components/settings/UserSettings.vue'

import { SETTINGS_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'dashboard',
})

const profileStore = useProfile()

const handleDeleteUserAccount = async () => {
  await profileStore.handleDeleteProfile()
}
</script>
