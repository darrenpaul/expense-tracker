<template>
  <div class="flex flex-row gap-4 justify-center">
    <DropDownButton
      :is-open="accountDropdownOpen"
      :button-text="accountName"
      :button-style="'button-secondary'"
      @toggle-is-open="accountDropdownOpen = $event"
    >
      <template #dropdownButtons>
        <button
          :class="account === 'All' ? 'button' : 'button-secondary'"
          :value="'All'"
          @click="() => onAccountClick('All')"
        >
          All
        </button>

        <button
          v-for="{ id, name } in accountStore.accounts"
          :key="id"
          :class="['truncate', account === id ? 'button' : 'button-secondary']"
          :value="id"
          @click="() => onAccountClick(id)"
        >
          {{ name }}
        </button>
      </template>
    </DropDownButton>
  </div>
</template>

<script setup lang="ts">
import DropDownButton from '~~/components/buttons/DropDownButton.vue'
import { useAccounts } from '~~/stores/accounts'

const emit = defineEmits(['onAccountChange'])

const props = defineProps({
  account: { type: String, required: true },
})

const accountStore = useAccounts()

const accountDropdownOpen = ref(false)

const accountName = computed(() => {
  if (props.account === 'All') return 'All'
  return accountStore.accounts.find(({ id }) => props.account === id)?.name
})

const onAccountClick = (value: string) => {
  accountDropdownOpen.value = false
  emit('onAccountChange', value)
}
</script>
