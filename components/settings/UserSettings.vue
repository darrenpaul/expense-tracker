<template>
  <div class="card w-fit">
    <h3>{{ COPY.userSettings }}</h3>

    <form>
      <!-- DEFAULT CURRENCY -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="defaultCurrency">{{ COPY.defaultCurrency }}</label>
        </div>
        <input
          v-model="defaultCurrency"
          :placeholder="COPY.defaultCurrencyPlaceholder"
          name="defaultCurrency"
          type="text"
        />
      </div>

      <!-- MONTH START -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="monthStart">{{ COPY.monthStart }}</label>
        </div>
        <input
          v-model="monthStart"
          :placeholder="COPY.monthStartPlaceholder"
          name="monthStart"
          pattern="[0-9]*"
          type="text"
        />
      </div>

      <button class="button" @click="onSaveUserSettings">
        {{ COPY.save }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import COPY from '~~/constants/copy/settings'
import { useProfile } from '~~/stores/profile'
import { IUserSettings } from '~~/types/userSettings'
import { updateUserSettings } from '~~/endpoints/userSettings'
import { useUserSettings } from '~~/stores/userSettings'

const profile = useProfile()
const userSettingStore = useUserSettings()

const defaultCurrency = ref(userSettingStore.currency)
const monthStart = ref(userSettingStore.monthStart)

watch(
  () => userSettingStore.currency,
  (value) => {
    defaultCurrency.value = value
  }
)

const onSaveUserSettings = async (event: Event) => {
  event.preventDefault()
  if (!profile.userId) return

  const data: IUserSettings = {
    id: userSettingStore.id,
    userId: profile.userId,
    currency: defaultCurrency.value,
    monthStart: monthStart.value,
  }

  await updateUserSettings(data)

  userSettingStore.fetch()

  alert('Created user settings')
}
</script>
