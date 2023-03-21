<template>
  <header class="main-navigation-header">
    <MobileNavigation :links="LINKS" @on-logout="onLogout" />

    <DesktopNavigation :links="LINKS" @on-logout="onLogout" />
  </header>
</template>

<script setup lang="ts">
import MobileNavigation from './MobileNavigation.vue'
import DesktopNavigation from './DesktopNavigation.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { PROFILE_SETTINGS_ROUTE } from '~~/constants/routes/profile'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import { useProfile } from '~~/stores/profile'
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

const router = useRouter()
const profile = useProfile()

const onLogout = async () => {
  await profile.logout()
  router.replace(HOME_ROUTE.path)
}
</script>

<style lang="scss">
@import './mainNavigation.scss';
</style>
