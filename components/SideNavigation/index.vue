<template>
  <header class="side-navigation-header">
    <div class="side-navigation-container side-navigation-expanded">
      <div class="side-navigation-content side-navigation-expanded">
        <!-- BRANDING -->
        <NuxtLink class="side-navigation-brand-container" :to="HOME_ROUTE.path">
          <BrandIcon />
          <h1 class="side-navigation-brand-text">
            {{ COMMON_COPY.brand }}
          </h1>
        </NuxtLink>

        <div class="side-navigation-links">
          <NuxtLink
            v-for="{ displayName, name, path } in LINKS"
            :key="name"
            :class="[
              'side-navigation-link',
              matchRoute(path) === true && 'active',
            ]"
            :to="path"
          >
            {{ displayName }}
          </NuxtLink>
        </div>

        <button
          v-if="profile.authenticated === true"
          class="dropdown-button-item"
          @click="onLogout"
        >
          {{ NAVIGATION_COPY.logout }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { PROFILE_SETTINGS_ROUTE } from '~~/constants/routes/profile'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import { useProfile } from '~~/stores/profile'
import { CATEGORIES_ROUTE } from '~~/constants/routes/categories'

const LINKS = [
  HOME_ROUTE,
  DASHBOARD_ROUTE,
  TRANSACTIONS_ROUTE,
  ACCOUNTS_ROUTE,
  CATEGORIES_ROUTE,
  GOALS_ROUTE,
  PROFILE_SETTINGS_ROUTE,
]

const route = useRoute()
const router = useRouter()
const profile = useProfile()

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}

const onLogout = async () => {
  await profile.logout()
  router.replace(HOME_ROUTE.path)
}
</script>

<style lang="scss">
@import './sideNavigation.scss';
</style>
