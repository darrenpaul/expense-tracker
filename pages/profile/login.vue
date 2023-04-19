<template>
  <div class="login-page-container">
    <div class="login-page-image-container">
      <LoginRegister />
    </div>

    <div class="login-page-content-container">
      <div class="login-page-form-container">
        <h2 class="mb-4 md:mb-8">{{ COPY.accountLogin }}</h2>

        <form class="form max-w-sm">
          <!-- EMAIL -->
          <div class="input-group">
            <label class="label" for="email">{{ COPY.email }}</label>

            <input
              v-model="email"
              class="input"
              :placeholder="COPY.emailPlaceholder"
              name="email"
              type="email"
            />
          </div>

          <!-- PASSWORD -->
          <div class="input-group">
            <label class="label" for="password">{{ COPY.password }}</label>

            <input
              v-model="password"
              class="input"
              :placeholder="COPY.passwordPlaceHolder"
              name="password"
              type="password"
            />
          </div>

          <button class="button" @click="onLogin">
            <template v-if="isRequesting === false">
              {{ COPY.login }}
            </template>
            <CircleSpinner v-else :fill="'var(--secondary)'" />
          </button>

          <p>
            {{ COPY.noAccount }}

            <NuxtLink class="navigation-link" :to="PROFILE_REGISTER_ROUTE.path">
              {{ PROFILE_REGISTER_ROUTE.displayName }}
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import isEmail from 'validator/es/lib/isEmail'
import COPY from '~~/constants/copy/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { useProfile } from '~~/stores/profile'
import { useNotification } from '~~/stores/notification'
import { PROFILE_REGISTER_ROUTE } from '~~/constants/routes/profile'
import LoginRegister from '~~/components/illustrations/LoginRegister.vue'
import CircleSpinner from '~~/components/spinners/CircleSpinner.vue'

const router = useRouter()
const profile = useProfile()
const notification = useNotification()

const email = ref('')
const password = ref('')
const isRequesting = ref(false)

onMounted(() => {
  if (profile.authenticated === true) {
    router.replace(DASHBOARD_ROUTE.path)
  }
})

const fieldsValid = () => {
  if (email.value === '' || !isEmail(email.value)) {
    notification.addNotification({
      message: COPY.emailRequired,
      type: 'error',
    })
    return false
  }

  if (password.value === '') {
    notification.addNotification({
      message: COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  return true
}

const onLogin = async (event: Event) => {
  event.preventDefault()

  if (isRequesting.value === true) return

  if (fieldsValid() === false) {
    return false
  }

  isRequesting.value = true

  try {
    await profile.login(email.value, password.value)
    if (profile.authenticated) {
      useProfile().fetchAllData()
      router.replace(DASHBOARD_ROUTE.path)
    }
  } catch (error) {
    notification.addNotification({
      message: error?.message,
      type: 'error',
    })
  } finally {
    isRequesting.value = false
  }
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/profile/login.scss';
</style>
