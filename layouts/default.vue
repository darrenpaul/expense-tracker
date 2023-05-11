<template>
  <ClientOnly>
    <main class="h-full">
      <DefaultNavigation />

      <section class="layout-section pt-[5.625rem]">
        <slot />
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import DefaultNavigation from '~~/components/navigation/DefaultNavigation/index.vue'
</script>
