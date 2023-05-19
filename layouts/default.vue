<template>
  <ClientOnly>
    <main class="h-full">
      <DefaultNavigation />

      <section class="layout-section pt-[5.625rem] px-8 md:px-16">
        <slot />
      </section>

      <footer class="w-full h-[50vh] md:h-[30] bg-[#05386B]"></footer>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import DefaultNavigation from '~~/components/navigation/DefaultNavigation/index.vue'
</script>
