<template>
  <div class="card-slim card-dark card-stretch category-card">
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
import { ICategory } from '~~/types/category'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { CATEGORY_ICONS } from '~~/constants/category'
import MissingCategoryIcon from '~~/components/icons/categories/MissingCategoryIcon.vue'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ category: ICategory; totalAmount: number }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

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
  const matchedTransactions = transactionStore.transactions.filter(
    (transaction) => transaction.category.id === props.category.id
  )

  const transactionAmounts = matchedTransactions.map(
    (transaction) => transaction.amount
  )

  return transactionAmounts.reduce((a, b) => a + b, 0)
})

const percentage = computed(() => {
  const percentageAmount = parseFloat(
    ((categoryTotal.value / props.totalAmount) * 100).toFixed(0)
  )

  return `${percentageAmount}%`
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
