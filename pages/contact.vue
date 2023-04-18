<template>
  <div>
    <h3>Contact</h3>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
