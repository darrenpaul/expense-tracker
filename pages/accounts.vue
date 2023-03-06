<template>
  <div>
    <h1>Accounts</h1>

    <button @click="() => (showAccountModal = true)">
      {{ COMMON_COPY.addAccount }}
    </button>

    <div class="grid-3-col">
      <div
        v-for="{ name, id } in accountStore.accounts"
        :key="id"
        class="card card-stretch cursor-pointer"
        @click="() => onAccountEdit(id)"
      >
        <p class="text-center">
          {{ name }}
        </p>
      </div>
    </div>

    <Modal :is-open="showAccountModal" @close="onCloseAccountsModal">
      <AccountsForm :account="account" @close-modal="onCloseAccountsModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY } from '~~/constants/copy'
import AccountsForm from '~~/components/forms/AccountsForm.vue'
import { useAccounts } from '~~/stores/accounts'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const accountStore = useAccounts()

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
