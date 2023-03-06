<template>
  <div>
    <h2>{{ SETTINGS_COPY.userSettings }}</h2>

    <form>
      <div class="input-group">
        <label for="defaultCurrency">{{ SETTINGS_COPY.defaultCurrency }}</label>
        <input
          v-model="defaultCurrency"
          :placeholder="SETTINGS_COPY.defaultCurrencyPlaceholder"
          name="defaultCurrency"
          type="text"
        />
      </div>

      <button @click="onSaveUserSettings">{{ SETTINGS_COPY.save }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SETTINGS_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'
import { IUserSettings } from '~~/types/userSettings'
import { updateUserSettings } from '~~/endpoints/userSettings'
import { useUserSettings } from '~~/stores/userSettings'

const profile = useProfile()
const userSettings = useUserSettings()

const defaultCurrency = ref(userSettings.currency)

watch(
  () => userSettings.currency,
  (value) => {
    defaultCurrency.value = value
  }
)

const onSaveUserSettings = async (event: Event) => {
  event.preventDefault()
  if (!profile.userId) return

  const data: IUserSettings = {
    id: userSettings.id,
    userId: profile.userId,
    currency: defaultCurrency.value,
  }

  await updateUserSettings(data)

  userSettings.fetchUserSettings()

  alert('Created user settings')
}
</script>
