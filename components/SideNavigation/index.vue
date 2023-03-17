<template>
  <header class="side-navigation-header">
    <div
      :class="[
        'side-navigation-container',
        expanded === true
          ? 'side-navigation-expanded'
          : 'side-navigation-collapsed',
      ]"
    >
      <div
        :class="[
          'side-navigation-content',
          expanded === true
            ? 'side-navigation-expanded'
            : 'side-navigation-collapsed',
        ]"
      >
        <!-- BRANDING -->
        <NuxtLink class="side-navigation-brand-container" :to="HOME_ROUTE.path">
          <BrandIcon :size="expanded ? '1' : '4'" :fill="'var(--secondary)'" />

          <h1 v-if="expanded" class="side-navigation-brand-text">
            {{ COMMON_COPY.brand }}
          </h1>
        </NuxtLink>

        <!-- PAGE LINKS -->
        <div class="side-navigation-links">
          <div
            v-for="{ displayName, name, path, icon } in LINKS"
            :key="name"
            :class="[
              'side-navigation-link-container',
              matchRoute(path) === true && 'active',
            ]"
          >
            <NuxtLink class="side-navigation-link" :to="path">
              <component :is="icon" :fill="'var(--secondary)'" :size="'42'" />

              {{ expanded ? displayName : '' }}
            </NuxtLink>
          </div>

          <div class="side-navigation-link-container">
            <button class="side-navigation-link" @click="onLogout">
              <LogoutIcon :fill="'var(--secondary)'" :size="'42'" />

              {{ expanded ? NAVIGATION_COPY.logout : '' }}
            </button>
          </div>
        </div>

        <!-- EXPAND TOGGLE -->
        <div class="side-navigation-links">
          <div class="side-navigation-link-container">
            <button
              v-if="profile.authenticated === true"
              class="side-navigation-link"
              @click="onExpandToggle"
            >
              <ExpandIcon
                v-if="expanded"
                :size="'42'"
                :fill="'var(--secondary)'"
              />
              <CollapseIcon v-else :size="'42'" :fill="'var(--secondary)'" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoutIcon from '~~/components/icons/sidePanel/LogoutIcon.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import ExpandIcon from '~~/components/icons/sidePanel/ExpandIcon.vue'
import CollapseIcon from '~~/components/icons/sidePanel/CollapseIcon.vue'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { PROFILE_SETTINGS_ROUTE } from '~~/constants/routes/profile'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import { useProfile } from '~~/stores/profile'
import { useUserSettings } from '~~/stores/userSettings'
import { CATEGORIES_ROUTE } from '~~/constants/routes/categories'
import { BUDGETS_ROUTE } from '~~/constants/routes/budgets'

const LINKS = [
  DASHBOARD_ROUTE,
  TRANSACTIONS_ROUTE,
  ACCOUNTS_ROUTE,
  CATEGORIES_ROUTE,
  BUDGETS_ROUTE,
  GOALS_ROUTE,
  PROFILE_SETTINGS_ROUTE,
]

const route = useRoute()
const router = useRouter()
const profile = useProfile()
const userSettingStore = useUserSettings()

const expanded = ref(userSettingStore.sidePanelExpanded)

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}

const onExpandToggle = () => {
  expanded.value = !expanded.value
  userSettingStore.saveSidePanelState(expanded.value)
}

const onLogout = async () => {
  await profile.logout()
  router.replace(HOME_ROUTE.path)
}
</script>

<style lang="scss">
@import './sideNavigation.scss';
</style>
