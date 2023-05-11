<template>
  <div class="card-slim card card-stretch category-card">
    <div class="category-card-title-amount-group">
      <div class="category-card-title-icon-group">
        <component
          :is="iconForCategory"
          :fill="'var(--primary)'"
          :size="'32'"
        />

        <h3>{{ category.name }}</h3>
      </div>

      <h3>
        {{
          currencyFormat({
            value: categoryTotal,
            currency: userSettingStore.currency,
          })
        }}
      </h3>
    </div>

    <div class="category-card-percentage-button-group">
      <ProgressBar
        :current-amount="categoryTotal"
        :max-amount="props.totalAmount"
        :labels="['0%', '100%']"
        :progress-bar-color="'bg-green-500'"
        :hide-inner-text="true"
      />

      <div class="category-card-button-group">
        <button class="button-icon-secondary" @click="onDelete">
          <TrashIcon :fill="'var(--primary)'" />
        </button>

        <button class="button-icon" @click="onEdit"><PencilIcon /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isWithinInterval } from 'date-fns'
import { ICategory } from '~~/types/category'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { CATEGORY_ICONS } from '~~/constants/category'
import MissingCategoryIcon from '~~/components/icons/categories/MissingCategoryIcon.vue'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import { sumArrayNumbers } from '~~/helpers/maths'
import { ITransaction } from '~~/types/transaction'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{
  category: ICategory
  totalAmount: number
  transactions: Array<ITransaction>
}>()

const userSettingStore = useUserSettings()

const iconForCategory = computed(() => {
  const matchedComponent = CATEGORY_ICONS.find(
    ({ value }) => props.category.icon === value
  )
  if (matchedComponent) {
    return matchedComponent.component
  }
  return MissingCategoryIcon
})

const categoryTotal = computed(() => {
  const transactionsForCategory = props.transactions.filter(
    (transaction) => transaction.category.id === props.category.id
  )

  const transactionAmounts = transactionsForCategory.map(
    (transaction) => transaction.amount
  )

  return sumArrayNumbers(transactionAmounts)
})

const onEdit = () => {
  emit('onEdit', props.category.id)
}

const onDelete = () => {
  emit('onDelete', props.category.id)
}
</script>

<style lang="scss">
@import './cards.scss';
</style>
