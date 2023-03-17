<template>
  <div class="card card-stretch whitespace-nowrap">
    <h3 class="font-normal">{{ title }}</h3>
    <h3 class="font-black">{{ amount }}</h3>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  amount: { type: String, default: '' },
})
</script>
