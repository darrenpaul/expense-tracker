<template>
  <div class="navigation-desktop">
    <!-- BRANDING -->
    <NuxtLink class="navigation-brand-container" :to="HOME_ROUTE.path">
      <div class="flex flex-col items-center">
        <BrandIcon size="2" fill="#05386B" />

        <h1 class="navigation-brand-text !text-[#05386B]">
          {{ COMMON_COPY.brand }}
        </h1>
      </div>
    </NuxtLink>

    <div class="navigation-links justify-center">
      <NuxtLink
        v-for="{ displayName, name, path } in props.pageLinks"
        :key="name"
        :class="['navigation-link', matchRoute(path) === true && 'active']"
        :to="path"
      >
        {{ displayName }}
      </NuxtLink>
    </div>

    <div class="flex items-center justify-end gap-4">
      <NuxtLink
        v-for="{ displayName, name, path } in props.accountLinks"
        :key="name"
        class="button-secondary !w-fit !m-0"
        :to="path"
      >
        {{ displayName }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import { ILink } from '~~/types/link'

const props = defineProps<{
  pageLinks: Array<ILink>
  accountLinks: Array<ILink>
}>()

const route = useRoute()

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}
</script>

<style lang="scss">
@import './navigation.scss';
</style>
