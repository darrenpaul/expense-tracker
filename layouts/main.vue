<template>
  <ClientOnly>
    <main class="main-layout-container">
      <DashboardNavigation />

      <section class="main-layout-content">
        <slot />
      </section>

      <!-- <ActionButtons /> -->
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import DashboardNavigation from '~~/components/navigation/DashboardNavigation/index.vue'
// import ActionButtons from '~~/components/ActionButtons/index.vue'
</script>
