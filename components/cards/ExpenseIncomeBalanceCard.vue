<template>
  <div class="card flex flex-col gap-3 w-full md:w-1/2">
    <div class="border-b pb-3 text-center">
      <h4>{{ TRANSACTION_COPY.balance }}</h4>
      <h3>
        {{
          currencyFormat({
            value: balance(),
            currency: userSettingStore.currency,
          })
        }}
      </h3>
    </div>

    <div class="border-b pb-3 text-center">
      <h4>{{ TRANSACTION_COPY.moneyIn }}</h4>
      <h3>
        {{
          currencyFormat({
            value: transactionStore.income(),
            currency: userSettingStore.currency,
          })
        }}
      </h3>
    </div>

    <div class="text-center">
      <h4>{{ TRANSACTION_COPY.moneyOut }}</h4>
      <h3>
        {{
          currencyFormat({
            value: transactionStore.expense(),
            currency: userSettingStore.currency,
          })
        }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICategory } from '~~/types/category'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { CATEGORY_ICONS } from '~~/constants/category'
import MissingCategoryIcon from '~~/components/icons/categories/MissingCategoryIcon.vue'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import GlanceCard from '~~/components/cards/GlanceCard.vue'
import { balance } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useCategories } from '~~/stores/categories'
import categoryUsage from '~~/helpers/charts/categories/categoriesUsage'
import ExpenseIncomeBalanceCard from '~~/components/cards/ExpenseIncomeBalanceCard.vue'

const emit = defineEmits(['onEdit', 'onDelete'])

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
