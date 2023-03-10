<template>
  <div class="card card-stretch whitespace-nowrap">
    <h3>{{ title }}</h3>
    <h2>{{ amount }}</h2>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  amount: { type: String, default: '' },
})
</script>
