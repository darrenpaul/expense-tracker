<template>
  <section>
    <div class="card">
      <h2 class="mb-4">{{ COPY.accountRegister }}</h2>

      <form>
        <!-- FIRST NAME -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.firstName }}</label>
          </div>
          <input
            v-model="firstName"
            :placeholder="COPY.firstName"
            name="fname"
            type="text"
          />
        </div>

        <!-- LAST NAME -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.lastName }}</label>
          </div>
          <input
            v-model="lastName"
            :placeholder="COPY.lastNamePlaceholder"
            name="lname"
            type="text"
          />
        </div>

        <!-- EMAIL -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.email }}</label>
          </div>
          <input
            v-model="email"
            :placeholder="COPY.emailPlaceholder"
            name="email"
            type="email"
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.password }}</label>
          </div>
          <input
            v-model="password"
            :placeholder="COPY.passwordPlaceHolder"
            name="password"
            type="password"
          />
        </div>
        <!-- PASSWORD REPEAT -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.passwordRepeat }}</label>
          </div>
          <input
            v-model="passwordConfirm"
            :placeholder="COPY.passwordPlaceHolder"
            name="passwordConfirm"
            type="password"
          />
        </div>

        <button class="button" @click="onRegisterUser">
          {{ COPY.register }}
        </button>
      </form>
    </div>
  </section>
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
