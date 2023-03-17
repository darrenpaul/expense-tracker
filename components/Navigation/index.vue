<template>
  <header>
    <div class="navigation-content">
      <!-- BRANDING -->
      <NuxtLink class="navigation-brand-container" :to="HOME_ROUTE.path">
        <BrandIcon :size="'3'" :fill="'var(--secondary)'" />
        <h1 class="navigation-brand-text">
          {{ COMMON_COPY.brand }}
        </h1>
      </NuxtLink>

      <div class="navigation-links">
        <NuxtLink
          v-for="{ displayName, name, path } in links"
          :key="name"
          :class="['navigation-link', matchRoute(path) === true && 'active']"
          :to="path"
        >
          {{ displayName }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { HOME_ROUTE } from '~~/constants/routes/home'
import {
  PROFILE_LOGIN_ROUTE,
  PROFILE_REGISTER_ROUTE,
} from '~~/constants/routes/profile'
import { COMMON_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'

const route = useRoute()
const profileStore = useProfile()

const links = computed(() => {
  if (profileStore.authenticated === true) {
    return [HOME_ROUTE, DASHBOARD_ROUTE]
  }
  return [HOME_ROUTE, PROFILE_LOGIN_ROUTE, PROFILE_REGISTER_ROUTE]
})

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}
</script>

<style lang="scss">
@import './navigation.scss';
</style>
