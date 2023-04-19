<template>
  <div class="login-page-container">
    <div class="login-page-image-container">
      <LoginRegister />
    </div>

    <div class="login-page-content-container">
      <div class="login-page-form-container">
        <h2 class="mb-4">{{ COPY.accountRegister }}</h2>

        <form class="form max-w-sm">
          <!-- FIRST NAME -->
          <div class="input-groups">
            <div class="input-group">
              <label class="label" for="fname">{{ COPY.firstName }}</label>

              <input
                v-model="firstName"
                class="input"
                :placeholder="COPY.firstNamePlaceholder"
                name="fname"
                type="text"
              />
            </div>

            <!-- LAST NAME -->
            <div class="input-group">
              <label class="label" for="lname">{{ COPY.lastName }}</label>

              <input
                v-model="lastName"
                class="input"
                :placeholder="COPY.lastNamePlaceholder"
                name="lname"
                type="text"
              />
            </div>
          </div>

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

          <div class="input-groups">
            <!-- PASSWORD -->
            <div class="input-group">
              <label class="label" for="email">{{ COPY.password }}</label>
              <input
                v-model="password"
                class="input"
                :placeholder="COPY.passwordPlaceHolder"
                name="password"
                type="password"
              />
            </div>

            <!-- PASSWORD REPEAT -->
            <div class="input-group">
              <label class="label" for="passwordConfirm">{{
                COPY.passwordRepeat
              }}</label>

              <input
                v-model="passwordConfirm"
                class="input"
                :placeholder="COPY.passwordPlaceHolder"
                name="passwordConfirm"
                type="password"
              />
            </div>
          </div>

          <button class="button" @click="onRegisterUser">
            <template v-if="isRequesting === false">
              {{ COPY.register }}
            </template>
            <CircleSpinner v-else :fill="'var(--secondary)'" />
          </button>

          <p>
            {{ COPY.noAccount }}

            <NuxtLink class="navigation-link" :to="PROFILE_LOGIN_ROUTE.path">
              {{ PROFILE_LOGIN_ROUTE.displayName }}
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import isEmail from 'validator/lib/isEmail'
import COPY from '~~/constants/copy/profile'
import { createUserAccount } from '~~/endpoints/users'
import { useProfile } from '~~/stores/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { createUserSettings } from '~~/endpoints/userSettings'
import { createCategory } from '~~/endpoints/category'
import {
  initialAccounts,
  initialCategories,
  initialSettings,
} from '~~/constants/defaults/newAccount'
import { useNotification } from '~~/stores/notification'
import { createAccount } from '~~/endpoints/accounts'
import { PROFILE_LOGIN_ROUTE } from '~~/constants/routes/profile'
import LoginRegister from '~~/components/illustrations/LoginRegister.vue'
import CircleSpinner from '~~/components/spinners/CircleSpinner.vue'

const router = useRouter()
const profile = useProfile()
const notification = useNotification()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isRequesting = ref(false)

onMounted(() => {
  if (profile.authenticated === true) {
    router.replace(DASHBOARD_ROUTE.path)
  }
})

const fieldsValid = () => {
  if (firstName.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.firstNameRequired,
      type: 'error',
    })
    return false
  }

  if (lastName.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.lastNameRequired,
      type: 'error',
    })
    return false
  }

  if (email.value === '' || !isEmail(email.value)) {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.emailRequired,
      type: 'error',
    })
    return false
  }

  if (password.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  if (passwordConfirm.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  if (password.value !== passwordConfirm.value) {
    notification.addNotification({
      title: 'Notification Title',
      message: COPY.passwordMustMatch,
      type: 'error',
    })
    return false
  }
  return true
}

const onRegisterUser = async (event: Event) => {
  event.preventDefault()

  if (isRequesting.value === true) return

  if (fieldsValid() === false) {
    return false
  }

  const userData = {
    username: firstName.value.toLowerCase() + lastName.value.toLowerCase(),
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  }

  isRequesting.value = true

  try {
    const { id } = await createUserAccount(userData)

    await profile.login(email.value, password.value)

    await createUserSettings({ ...initialSettings, userId: id })

    for (const category of initialCategories) {
      await createCategory({ ...category, userId: id })
    }

    for (const account of initialAccounts) {
      await createAccount({ ...account, userId: id })
    }

    if (profile.authenticated) {
      profile.fetchAllData()
      router.replace(DASHBOARD_ROUTE.path)
    }
  } catch (error) {
    notification.addNotification({
      title: 'Notification Title',
      message: error.message,
      type: 'error',
    })
    isRequesting.value = false
  }
}
</script>
