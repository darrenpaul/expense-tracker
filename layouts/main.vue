<template>
  <main class="main-layout-container">
    <MainNavigation />

    <section class="main-layout-content">
      <slot />
    </section>
  </main>
</template>

<script setup lang="ts">
import MainNavigation from '~~/components/MainNavigation/index.vue'
</script>
