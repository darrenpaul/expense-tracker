<template>
  <section>
    <h1>{{ COMMON_COPY.registerAccount }}</h1>

    <form>
      <!-- FIRST NAME & LAST NAME -->
      <div class="row">
        <!-- FIRST NAME -->
        <div class="input-group">
          <label for="displayName">{{ COMMON_COPY.firstName }}</label>
          <input
            v-model="firstName"
            :placeholder="COMMON_COPY.firstName"
            name="fname"
            type="text"
          />
        </div>

        <!-- LAST NAME -->
        <div class="input-group">
          <label for="displayName">{{ COMMON_COPY.lastName }}</label>
          <input
            v-model="lastName"
            :placeholder="COMMON_COPY.lastNamePlaceholder"
            name="lname"
            type="text"
          />
        </div>
      </div>

      <!-- EMAIL -->
      <div class="input-group">
        <label for="displayName">{{ COMMON_COPY.email }}</label>
        <input
          v-model="email"
          :placeholder="COMMON_COPY.emailPlaceholder"
          name="email"
          type="email"
        />
      </div>

      <!-- PASSWORD & PASSWORD CONFIRM -->
      <div class="row">
        <!-- PASSWORD -->
        <div class="input-group">
          <label for="displayName">{{ COMMON_COPY.password }}</label>
          <input
            v-model="password"
            :placeholder="COMMON_COPY.passwordPlaceHolder"
            name="password"
            type="password"
          />
        </div>
        <div class="input-group">
          <label for="displayName">{{ COMMON_COPY.passwordRepeat }}</label>
          <input
            v-model="passwordConfirm"
            :placeholder="COMMON_COPY.passwordPlaceHolder"
            name="passwordConfirm"
            type="password"
          />
        </div>
      </div>

      <button @click="onRegisterUser">{{ COMMON_COPY.register }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import isEmail from 'validator/lib/isEmail'
import { createUserAccount } from '~~/endpoints/users'
import { COMMON_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { createUserSettings } from '~~/endpoints/userSettings'
import { INewUserSettings } from '~~/types/userSettings'
import { createCategory } from '~~/endpoints/category'
import { INewCategory } from '~~/types/category'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'
import { INewAccount } from '~~/types/account'
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
      message: COMMON_COPY.firstNameRequired,
      type: 'error',
    })
    return false
  }

  if (lastName.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.lastNameRequired,
      type: 'error',
    })
    return false
  }

  if (email.value === '' || !isEmail(email.value)) {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.emailRequired,
      type: 'error',
    })
    return false
  }

  if (password.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  if (passwordConfirm.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  if (password.value !== passwordConfirm.value) {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.passwordMustMatch,
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

    const userSettingsData: INewUserSettings = {
      userId: id,
      currency: 'ZAR',
    }

    await createUserSettings(userSettingsData)

    const userCategories: Array<INewCategory> = [
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
        name: 'Groceries',
        icon: '',
      },
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
        name: 'Petrol',
        icon: '',
      },
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_INCOME.displayName,
        name: 'Salary',
        icon: '',
      },
    ]

    for (const category of userCategories) {
      await createCategory(category)
    }

    const userAccounts: Array<INewAccount> = [
      {
        userId: id,
        name: 'Cash',
        includeInBalance: true,
      },
      {
        userId: id,
        name: 'Credit Card',
        includeInBalance: false,
      },
      {
        userId: id,
        name: 'Savings',
        includeInBalance: true,
      },
    ]

    for (const account of userAccounts) {
      await createAccount(account)
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
