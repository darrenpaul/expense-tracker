<template>
  <main class="main-layout-container">
    <MainNavigation />

    <section class="main-layout-content">
      <slot />
    </section>

    <ActionButtons />
  </main>
</template>

<script setup lang="ts">
import MainNavigation from '~~/components/MainNavigation/index.vue'
import ActionButtons from '~~/components/ActionButtons/index.vue'
</script>
