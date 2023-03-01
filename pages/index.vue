<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
