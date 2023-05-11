<template>
  <div class="navigation-mobile">
    <div class="navigation-mobile-content">
      <!-- BRANDING -->
      <NuxtLink class="navigation-brand-container" :to="HOME_ROUTE.path">
        <BrandIcon size="4" fill="var(--secondary)" />

        <h1 class="navigation-brand-text">
          {{ COMMON_COPY.brand }}
        </h1>
      </NuxtLink>

      <button @click="menuOpen = !menuOpen">
        <MenuIcon :fill="'var(--secondary)'" :size="'32'" />
      </button>
    </div>

    <Transition>
      <div v-if="menuOpen" class="navigation-mobile-menu">
        <div class="navigation-mobile-menu-header">
          <!-- BRANDING -->
          <NuxtLink class="navigation-brand-container" :to="HOME_ROUTE.path">
            <BrandIcon :size="'4'" :fill="'var(--secondary)'" />

            <h1 class="navigation-brand-text">
              {{ COMMON_COPY.brand }}
            </h1>
          </NuxtLink>

          <button @click="menuOpen = !menuOpen">
            <MenuIcon :fill="'var(--secondary)'" :size="'32'" />
          </button>
        </div>

        <div class="navigation-mobile-menu-links">
          <div
            v-for="{ displayName, name, path } in props.pageLinks"
            :key="name"
            :class="[
              'navigation-mobile-link-container',
              matchRoute(path) === true && 'active',
            ]"
          >
            <NuxtLink class="navigation-mobile-link" :to="path">
              {{ displayName }}
            </NuxtLink>
          </div>

          <div
            v-for="{ displayName, name, path } in props.accountLinks"
            :key="name"
            class="navigation-mobile-link-container"
          >
            <NuxtLink class="navigation-mobile-link" :to="path">
              {{ displayName }}
            </NuxtLink>
          </div>

          <div class="navigation-mobile-link-container">
            <button class="navigation-mobile-link" @click="onLogout">
              <LogoutIcon :fill="'var(--secondary)'" :size="'42'" />

              {{ NAVIGATION_COPY.logout }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import MenuIcon from '~~/components/icons/dashboardNavigation/MenuIcon.vue'
import LogoutIcon from '~~/components/icons/dashboardNavigation/LogoutIcon.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import { ILink } from '~~/types/link'
import { useProfile } from '~~/stores/profile'

const emit = defineEmits(['onLogout'])

const props = defineProps<{
  pageLinks: Array<ILink>
  accountLinks: Array<ILink>
}>()

const route = useRoute()

const menuOpen = ref(false)

const matchRoute = (path: string) => {
  if (path === route.path) return true
  if (path !== HOME_ROUTE.path && route.path.startsWith(path)) return true
  return false
}
watch(
  () => route.path,
  () => (menuOpen.value = false)
)
</script>
