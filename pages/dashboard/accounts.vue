<template>
  <div>
    <AccountsForm v-if="showAccountForm === true" />

    <div v-else class="accounts-container">
      <HeadingWithButton
        :heading="COMMON_COPY.accounts"
        :button-text="COMMON_COPY.addAccount"
        @on-click="onAddAccount"
      />

      <div class="account-cards">
        <template v-if="accountsLoading">
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </template>

        <TransitionGroup name="list">
          <AccountCard
            v-for="account in accountsInBalance"
            :key="account.id"
            :account="account"
            @on-edit="onAccountEdit"
            @on-delete="onShowConfirmDialog"
          />
        </TransitionGroup>
      </div>

      <div class="row between items-center mt-4 mb-2">
        <h3>{{ COMMON_COPY.otherAccounts }}</h3>
      </div>

      <div class="account-cards">
        <template v-if="accountsLoading">
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </template>

        <TransitionGroup name="list">
          <AccountCard
            v-for="account in accountsNotInBalance"
            :key="account.id"
            :account="account"
            @on-edit="onAccountEdit"
            @on-delete="onShowConfirmDialog"
          />
        </TransitionGroup>
      </div>

      <div class="row between items-center mt-4 mb-2">
        <h3>{{ COMMON_COPY.goalAccounts }}</h3>
      </div>

      <div class="account-cards">
        <template v-if="accountsLoading">
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </template>

        <TransitionGroup name="list">
          <AccountCard
            v-for="account in goalAccounts"
            :key="account.id"
            :account="account"
            @on-edit="onAccountEdit"
            @on-delete="onShowConfirmDialog"
          />
        </TransitionGroup>
      </div>

      <ConfirmDialog
        :show="showConfirmDialog"
        @close-modal="showConfirmDialog = false"
        @confirm="onAccountDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountCard from '~~/components/cards/AccountCard.vue'
import AccountCardSkeleton from '~~/components/cards/AccountCardSkeleton.vue'
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import { COMMON_COPY } from '~~/constants/copy'
import AccountsForm from '~~/components/forms/AccountsForm.vue'
import { useAccounts } from '~~/stores/accounts'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import { ACCOUNT_FORM_ROUTE } from '~~/constants/routes/accounts'
import { addQuery, clearQuery, hasQuery } from '~~/helpers/routerQuery'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const accountStore = useAccounts()
const route = useRoute()

const activeAccount = ref({})
const showAccountModal = ref(false)
const showConfirmDialog = ref(false)
const toDeleteId = ref('')
const showAccountForm = ref(false)

onMounted(() => {
  clearQuery()
})

watch(
  () => route.query,
  () => {
    if (hasQuery(ACCOUNT_FORM_ROUTE.queryKey)) {
      showAccountForm.value = true
    } else {
      showAccountForm.value = false
    }
  }
)

const accountsLoading = computed(() => accountStore.accounts.length === 0)

const accountsInBalance = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.filter(
    ({ includeInBalance }) => includeInBalance === true
  )
})

const accountsNotInBalance = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.filter(
    ({ includeInBalance }) => includeInBalance === false
  )
})

const goalAccounts = computed(() => {
  return accountStore.accounts.filter(({ name }) => name.includes('Goal'))
})

const onAddAccount = () => {
  const accountQuery = { [ACCOUNT_FORM_ROUTE.queryKey]: 'new' }
  addQuery(accountQuery)
}

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
