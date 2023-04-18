<template>
  <div class="login-page-container">
    <div class="login-page-image-container">
      <img
        class="login-page-image"
        src="https://res.cloudinary.com/darren-paul-photography/image/upload/v1681830181/expense-tracker/login-page_kzie8r.webp"
      />
    </div>

    <div class="login-page-content-container">
      <div class="login-page-form-container">
        <h2 class="mb-4">{{ COPY.accountRegister }}</h2>

        <form class="max-w-sm">
          <div class="input-group">
            <!-- FIRST NAME -->
            <input
              v-model="firstName"
              class="input mb-4"
              :placeholder="COPY.firstNamePlaceholder"
              name="fname"
              type="text"
            />

            <!-- LAST NAME -->
            <input
              v-model="lastName"
              class="input mb-4"
              :placeholder="COPY.lastNamePlaceholder"
              name="lname"
              type="text"
            />
          </div>

          <!-- EMAIL -->
          <input
            v-model="email"
            class="input mb-4"
            :placeholder="COPY.emailPlaceholder"
            name="email"
            type="email"
          />

          <div class="input-group">
            <!-- PASSWORD -->
            <input
              v-model="password"
              class="input mb-4"
              :placeholder="COPY.passwordPlaceHolder"
              name="password"
              type="password"
            />
            <!-- PASSWORD REPEAT -->

            <input
              v-model="passwordConfirm"
              class="input mb-4"
              :placeholder="COPY.passwordRepeatPlaceHolder"
              name="passwordConfirm"
              type="password"
            />
          </div>
          <button class="button" @click="onRegisterUser">
            {{ COPY.register }}
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

const router = useRouter()
const profile = useProfile()
const notification = useNotification()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

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
  }
}
</script>
