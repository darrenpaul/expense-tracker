<template>
  <div>
    <div class="row between items-center my-4">
      <h2>{{ COMMON_COPY.accounts }}</h2>

      <button class="button-secondary" @click="() => (showAccountModal = true)">
        {{ COMMON_COPY.addAccount }}
      </button>
    </div>

    <div class="grid-3-col">
      <GlanceCard
        v-for="{ id, name, includeInBalance } in accountStore.accounts"
        :key="id"
        :title="name"
        :amount="
          currencyFormat({
            value: balance(id, includeInBalance),
            currency: userSettingStore.currency,
          })
        "
        @click="() => onAccountEdit(id)"
      />
    </div>

    <Modal :is-open="showAccountModal" @close="onCloseAccountsModal">
      <AccountsForm :account="account" @close-modal="onCloseAccountsModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY } from '~~/constants/copy'
import AccountsForm from '~~/components/forms/AccountsForm.vue'
import { currencyFormat } from '~~/helpers/formatting'
import { useAccounts } from '~~/stores/accounts'
import { useUserSettings } from '~~/stores/userSettings'
import { balance } from '~~/helpers/transactions'
import GlanceCard from '~~/components/cards/GlanceCard.vue'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const accountStore = useAccounts()
const userSettingStore = useUserSettings()

const showAccountModal = ref(false)
const account = ref({})

const onCloseAccountsModal = () => {
  showAccountModal.value = false
  account.value = {}
}

const onAccountEdit = (accountId: string) => {
  const matchEntity = accountStore.accounts.find(({ id }) => id === accountId)

  if (matchEntity) {
    account.value = matchEntity
    showAccountModal.value = true
  }
}
</script>
