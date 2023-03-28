<template>
  <div class="main-navigation-desktop">
    <div
      :class="[
        'main-navigation-desktop-container',
        expanded === true
          ? 'main-navigation-desktop-expanded'
          : 'main-navigation-desktop-collapsed',
      ]"
    >
      <div
        :class="[
          'main-navigation-desktop-content',
          expanded === true
            ? 'main-navigation-desktop-expanded'
            : 'main-navigation-desktop-collapsed',
        ]"
      >
        <!-- BRANDING -->
        <NuxtLink
          class="main-navigation-desktop-brand-container"
          :to="HOME_ROUTE.path"
        >
          <BrandIcon :size="expanded ? '1' : '4'" :fill="'var(--secondary)'" />

          <h1 v-if="expanded" class="main-navigation-desktop-brand-text">
            {{ COMMON_COPY.brand }}
          </h1>
        </NuxtLink>

        <!-- PAGE LINKS -->
        <div class="main-navigation-desktop-links">
          <div
            v-for="{ displayName, name, path, icon } in props.links"
            :key="name"
            :class="[
              'main-navigation-desktop-link-container',
              matchRoute(path) === true && 'active',
            ]"
          >
            <NuxtLink class="main-navigation-desktop-link" :to="path">
              <component :is="icon" :fill="'var(--secondary)'" :size="'42'" />

              {{ expanded ? displayName : '' }}
            </NuxtLink>
          </div>

          <div class="main-navigation-desktop-link-container">
            <button class="main-navigation-desktop-link" @click="onLogout">
              <LogoutIcon :fill="'var(--secondary)'" :size="'42'" />

              {{ expanded ? NAVIGATION_COPY.logout : '' }}
            </button>
          </div>
        </div>

        <!-- EXPAND TOGGLE -->
        <div class="main-navigation-desktop-links">
          <div class="main-navigation-desktop-link-container">
            <button
              v-if="profile.authenticated === true"
              class="main-navigation-desktop-expand-container"
              @click="onExpandToggle"
            >
              <CollapseIcon
                :class="expanded ? 'rotation-180' : 'rotation-0'"
                :size="'42'"
                :fill="'var(--secondary)'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoutIcon from '~~/components/icons/mainNavigation/LogoutIcon.vue'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { COMMON_COPY, NAVIGATION_COPY } from '~~/constants/copy'
import BrandIcon from '~~/components/icons/BrandIcon.vue'
import CollapseIcon from '~~/components/icons/mainNavigation/CollapseIcon.vue'
import { useProfile } from '~~/stores/profile'
import { useUserSettings } from '~~/stores/userSettings'
import { ILink } from '~~/types/link'

const emit = defineEmits(['onLogout'])

const props = defineProps<{ links: Array<ILink> }>()

const route = useRoute()
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

const onLogout = () => {
  emit('onLogout')
}
</script>
