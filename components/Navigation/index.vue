<template>
  <header class="navigation-header">
    <MobileNavigation :page-links="pageLinks" :account-links="accountLinks" />

    <DesktopNavigation :page-links="pageLinks" :account-links="accountLinks" />
  </header>
</template>

<script setup lang="ts">
import MobileNavigation from './MobileNavigation.vue'
import DesktopNavigation from './DesktopNavigation.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import {
  PROFILE_LOGIN_ROUTE,
  PROFILE_REGISTER_ROUTE,
} from '~~/constants/routes/profile'
import { useProfile } from '~~/stores/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { ABOUT_ROUTE } from '~~/constants/routes/about'
import { CONTACT_ROUTE } from '~~/constants/routes/contact'
import { FEATURES_ROUTE } from '~~/constants/routes/features'

const route = useRoute()
const profileStore = useProfile()

const pageLinks = computed(() => {
  if (profileStore.authenticated === true) {
    return [HOME_ROUTE, DASHBOARD_ROUTE]
  }
  return [HOME_ROUTE, ABOUT_ROUTE, FEATURES_ROUTE, CONTACT_ROUTE]
})

const accountLinks = computed(() => {
  if (profileStore.authenticated === true) {
    return [DASHBOARD_ROUTE]
  }
  return [PROFILE_LOGIN_ROUTE, PROFILE_REGISTER_ROUTE]
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
