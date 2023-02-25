<template>
  <header>
    <div class="navigation-content">
      <!-- BRANDING -->
      <NuxtLink class="navigation-brand-container" :to="HOME_ROUTE.path">
        <BrandIcon />
        <h1 class="navigation-brand-text">
          {{ COMMON_COPY.brand }}
        </h1>
      </NuxtLink>

      <!-- GUEST ROUTES -->
      <div class="navigation-links">
        <NuxtLink
          v-for="{ displayName, name, path } in guestRoutes"
          :key="name"
          :class="['navigation-link', matchRoute(path) === true && 'active']"
          :to="path"
        >
          {{ displayName }}
        </NuxtLink>
      </div>

      <div class="navigation-account-container">
        <button
          class="navigation-account-dropdown-button"
          @click="onToggleTheme"
        >
          <SunIcon v-if="theme.darkMode" />
          <MoonIcon v-else />
        </button>

        <DropDownButton :button-style="'navigation-account-dropdown-button'">
          <template #buttonIcon>
            <UserIcon />
          </template>

          <template #dropdownButtons>
            <p class="dropdown-button-item">
              <b>{{ account.user?.username }}</b>
            </p>
            <template v-if="account.authenticated === false">
              <NuxtLink
                v-for="{ path, displayName, name } in guestDropdownOptions"
                :key="name"
                class="dropdown-button-item"
                :to="path"
              >
                {{ displayName }}
              </NuxtLink>
            </template>

            <template v-if="account.authenticated === true">
              <NuxtLink
                v-for="{ path, name, displayName } in userDropdownOptions"
                :key="name"
                class="dropdown-button-item"
                :to="path"
              >
                {{ displayName }}
              </NuxtLink>
            </template>

            <button
              v-if="account.authenticated === true"
              class="dropdown-button-item"
              @click="onLogout"
            >
              {{ NAVIGATION_COPY.logout }}
            </button>
          </template>
        </DropDownButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import DropDownButton from '~~/components/buttons/DropDownButton.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import {
  ACCOUNT_LOGIN_ROUTE,
  ACCOUNT_REGISTER_ROUTE,
} from '~~/constants/routes/account'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import { useAccount } from '~~/stores/account'
import { useTheme } from '~~/stores/theme'
import SunIcon from '~~/components/icons/SunIcon.vue'
import MoonIcon from '~~/components/icons/MoonIcon.vue'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import UserIcon from '~~/components/icons/UserIcon.vue'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'

const router = useRouter()
const route = useRoute()
const account = useAccount()
const theme = useTheme()

const guestRoutes = computed(() => {
  return [HOME_ROUTE, DASHBOARD_ROUTE]
})

const guestDropdownOptions = computed(() => {
  return [ACCOUNT_LOGIN_ROUTE, ACCOUNT_REGISTER_ROUTE]
})

const userDropdownOptions = computed(() => {
  return [ACCOUNT_LOGIN_ROUTE, ACCOUNT_REGISTER_ROUTE]
})

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}

const onToggleTheme = () => {
  theme.toggleTheme()
}

const onLogout = async () => {
  await account.logout()
  router.replace(HOME_ROUTE.path)
}
</script>

<style lang="scss">
@import './navigation.scss';
</style>
