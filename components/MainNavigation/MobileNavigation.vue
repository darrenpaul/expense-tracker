<template>
  <div class="main-navigation-mobile">
    <div class="main-navigation-mobile-content">
      <!-- BRANDING -->
      <NuxtLink class="main-navigation-brand-container" :to="HOME_ROUTE.path">
        <BrandIcon :size="'4'" :fill="'var(--secondary)'" />

        <h1 class="main-navigation-brand-text">
          {{ COMMON_COPY.brand }}
        </h1>
      </NuxtLink>

      <button @click="menuOpen = !menuOpen">
        <MenuIcon :fill="'var(--secondary)'" :size="'32'" />
      </button>
    </div>

    <Transition>
      <div v-if="menuOpen" class="main-navigation-mobile-menu">
        <div class="main-navigation-mobile-menu-header">
          <!-- BRANDING -->
          <NuxtLink
            class="main-navigation-brand-container"
            :to="HOME_ROUTE.path"
          >
            <BrandIcon :size="'4'" :fill="'var(--secondary)'" />

            <h1 class="main-navigation-brand-text">
              {{ COMMON_COPY.brand }}
            </h1>
          </NuxtLink>

          <button @click="menuOpen = !menuOpen">
            <MenuIcon :fill="'var(--secondary)'" :size="'32'" />
          </button>
        </div>

        <div class="main-navigation-mobile-menu-links">
          <div
            v-for="{ displayName, name, path, icon } in props.links"
            :key="name"
            :class="[
              'main-navigation-mobile-link-container',
              matchRoute(path) === true && 'active',
            ]"
          >
            <NuxtLink class="main-navigation-mobile-link" :to="path">
              <component :is="icon" :fill="'var(--secondary)'" :size="'42'" />
              {{ displayName }}
            </NuxtLink>
          </div>

          <div class="main-navigation-mobile-link-container">
            <button class="main-navigation-mobile-link" @click="onLogout">
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
import MenuIcon from '~~/components/icons/mainNavigation/MenuIcon.vue'
import LogoutIcon from '~~/components/icons/mainNavigation/LogoutIcon.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import { ILink } from '~~/types/link'

const emit = defineEmits(['onLogout'])

const props = defineProps<{ links: Array<ILink> }>()

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

const onLogout = () => {
  emit('onLogout')
}
</script>
