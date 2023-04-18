<template>
  <div>
    <h3>About</h3>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
