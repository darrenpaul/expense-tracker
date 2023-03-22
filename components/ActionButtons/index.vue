<template>
  <div class="action-buttons-container">
    <div v-if="isOpen" class="action-buttons-menu">
      <button class="button" @click="onShowTransaction">
        {{ TRANSACTION_COPY.addTransaction }}
      </button>
    </div>

    <button class="action-buttons-main-button" @click="isOpen = !isOpen">
      <CrossIcon :fill="'var(--secondary)'" />
    </button>

    <!-- TRANSACTION -->
    <Modal :is-open="showModal" @close="onModalClose">
      <TransactionForm v-if="showTransaction" @close-modal="onModalClose" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import TRANSACTION_COPY from '~~/constants/copy/transactions'
import CrossIcon from '~~/components/icons/CrossIcon.vue'
import TransactionForm from '~~/components/forms/TransactionForm.vue'

const isOpen = ref(false)
const showModal = ref(false)
const showTransaction = ref(false)
const showAccount = ref(false)

const onShowTransaction = () => {
  showModal.value = true
  showTransaction.value = true
  isOpen.value = false
}

const onModalClose = () => {
  showModal.value = false
  showTransaction.value = false
  showAccount.value = false
  isOpen.value = false
}
</script>

<style lang="scss">
@import './actionButtons.scss';
</style>
