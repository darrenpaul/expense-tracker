<template>
  <div class="flex items-center justify-between">
    <h3>{{ props.title }}</h3>

    <NuxtLink class="link" :to="props.url">{{ COPY.viewAll }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import COPY from '~~/constants/copy/dashboard'

const props = defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true },
})
</script>
