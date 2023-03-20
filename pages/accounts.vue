<template>
  <div class="accounts-container">
    <HeadingWithButton
      :heading="COMMON_COPY.accounts"
      :button-text="COMMON_COPY.addAccount"
      @on-click="() => (showAccountModal = true)"
    />

    <div class="account-cards">
      <AccountCard
        v-for="account in accountStore.accounts"
        :key="account.id"
        :account="account"
        @on-edit="onAccountEdit"
        @on-delete="onShowConfirmDialog"
      />
    </div>

    <Modal :is-open="showAccountModal" @close="onCloseAccountsModal">
      <AccountsForm
        :account="activeAccount"
        @close-modal="onCloseAccountsModal"
      />
    </Modal>

    <ConfirmDialog
      :show="showConfirmDialog"
      @close-modal="showConfirmDialog = false"
      @confirm="onAccountDelete"
    />
  </div>
</template>

<script setup lang="ts">
import AccountCard from '~~/components/cards/AccountCard.vue'
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import { COMMON_COPY } from '~~/constants/copy'
import AccountsForm from '~~/components/forms/AccountsForm.vue'
import { useAccounts } from '~~/stores/accounts'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const accountStore = useAccounts()

const activeAccount = ref({})
const showAccountModal = ref(false)
const showConfirmDialog = ref(false)
const toDeleteId = ref('')

const onShowConfirmDialog = (accountId: string) => {
  showConfirmDialog.value = true
  toDeleteId.value = accountId
}

const onCloseAccountsModal = () => {
  showAccountModal.value = false
  activeAccount.value = {}
}

const onAccountEdit = (accountId: string) => {
  const matchEntity = accountStore.accounts.find(({ id }) => id === accountId)

  if (matchEntity) {
    activeAccount.value = matchEntity
    showAccountModal.value = true
  }
}

const onAccountDelete = () => {
  showConfirmDialog.value = false
  showAccountModal.value = false
  activeAccount.value = {}
  accountStore.handleDeleteAccount(toDeleteId.value)
  toDeleteId.value = ''
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/accounts.scss';
</style>
