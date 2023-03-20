<template>
  <!-- TRANSACTION TYPE -->
  <div class="input-group">
    <div class="input-label-container">
      <label for="transactionTypeRadio">
        {{ TRANSACTION_COPY.transactionType }}
      </label>
    </div>

    <div class="transaction-type-buttons">
      <button
        v-for="{ id, displayName } in TRANSACTION_TYPES"
        :key="id"
        :class="
          selected === displayName ? 'button-small-active' : 'button-small'
        "
        :value="displayName"
        @click="onTransactionTypeClick"
      >
        {{ displayName }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TRANSACTION_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
} from '~~/constants/transactions'

const emit = defineEmits(['onChange'])

const props = defineProps({
  selected: { type: String, default: TRANSACTION_TYPE_EXPENSE.displayName },
})

const onTransactionTypeClick = (event: Event) => {
  event.preventDefault()
  const { value } = event.target
  emit('onChange', value)
}
</script>

<style lang="scss">
@import './transactionTypeSelect.scss';
</style>
