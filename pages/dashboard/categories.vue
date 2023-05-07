<template>
  <div class="categories-container">
    <!-- EXPENSE CATEGORIES -->
    <div class="categories-transaction-type">
      <div class="w-full">
        <HeadingWithButton
          :heading="COPY.expenseCategories"
          :button-text="COPY.addCategory"
          @on-click="
            () =>
              onShowCategoryCreateModal(TRANSACTION_TYPE_EXPENSE.displayName)
          "
        />

        <div class="category-cards">
          <CategoryCard
            v-for="item in categoryStore.expenseCategories"
            :key="item.id"
            :category="item"
            :total-amount="expenseTotal"
            :transactions="expenseTransactionsForMonth"
            @on-edit="onCategoryEdit"
            @on-delete="onShowConfirmDialog"
          />
        </div>
      </div>
      <div class="card category-chart-container">
        <Chart :options="expenseUsageOptions" />
      </div>
    </div>

    <!-- INCOME CATEGORIES -->
    <div class="categories-transaction-type">
      <div class="w-full">
        <HeadingWithButton
          :heading="COPY.incomeCategories"
          :button-text="COPY.addCategory"
          @on-click="
            () => onShowCategoryCreateModal(TRANSACTION_TYPE_INCOME.displayName)
          "
        />

        <div class="category-cards">
          <CategoryCard
            v-for="item in categoryStore.incomeCategories"
            :key="item.id"
            :category="item"
            :total-amount="incomeTotal"
            :transactions="incomeTransactionsForMonth"
            @on-edit="onCategoryEdit"
            @on-delete="onShowConfirmDialog"
          />
        </div>
      </div>

      <div class="card category-chart-container">
        <Chart :options="incomeUsageOptions" />
      </div>
    </div>

    <Modal :is-open="showCategoryModal" @close="onCloseCategoryModal">
      <CategoryForm
        :category="category"
        :transaction-type="transactionType"
        @on-create="onCategoryCreate"
        @on-update="onCategoryUpdate"
        @on-delete="onShowConfirmDialog"
        @close-modal="onCloseCategoryModal"
      />
    </Modal>

    <ConfirmDialog
      :show="showConfirmDialog"
      @close-modal="showConfirmDialog = false"
      @confirm="onCategoryDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { isWithinInterval } from 'date-fns'
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import COPY from '~~/constants/copy/category'
import { useCategories } from '~~/stores/categories'
import CategoryForm from '~~/components/forms/CategoryForm.vue'
import CategoryCard from '~~/components/cards/CategoryCard.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import { ICategory, INewCategory } from '~~/types/category'
import categoryUsage from '~~/helpers/charts/categories/categoriesUsage'
import { useTransactions } from '~~/stores/transactions'
import { ITransaction } from '~~/types/transaction'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { useUserSettings } from '~~/stores/userSettings'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const categoryStore = useCategories()
const transactionStore = useTransactions()
const userSettingStore = useUserSettings()

const showCategoryModal = ref(false)
const category = ref({})
const showConfirmDialog = ref(false)
const transactionType = ref(TRANSACTION_TYPE_EXPENSE.displayName)
const toDeleteId = ref('')

const expenseTransactionsForMonth = computed(() => {
  return transactionStore.expenseTransactionsForMonth()
})

const incomeTransactionsForMonth = computed(() => {
  return transactionStore.incomeTransactionsForMonth()
})

const expenseUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }

  return categoryUsage(
    expenseTransactionsForMonth.value as Array<ITransaction>,
    COPY.expenseUsage
  )
})

const incomeUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoryUsage(
    transactionStore.incomes as Array<ITransaction>,
    COPY.incomeUsage
  )
})

const expenseTotal = computed(() => {
  const transactionAmounts = transactionStore.expenses.map(
    (transaction) => transaction.amount
  )

  return transactionAmounts.reduce((a, b) => a + b, 0)
})

const incomeTotal = computed(() => {
  const transactionAmounts = transactionStore.incomes.map(
    (transaction) => transaction.amount
  )
  return transactionAmounts.reduce((a, b) => a + b, 0)
})

const onCloseCategoryModal = () => {
  showCategoryModal.value = false
  transactionType.value = ''
  category.value = {}
}

const onShowConfirmDialog = (categoryId: string) => {
  showConfirmDialog.value = true
  toDeleteId.value = categoryId
}

const onCategoryCreate = (data: INewCategory) => {
  categoryStore.handleCreateCategory(data)
}

const onCategoryUpdate = (data: ICategory) => {
  categoryStore.handleUpdateCategory(data)
}

const onCategoryEdit = (categoryId: string) => {
  const matchedCategory = categoryStore.categories.find(
    ({ id }) => id === categoryId
  )

  if (matchedCategory) {
    category.value = matchedCategory
    showCategoryModal.value = true
  }
}

const onShowCategoryCreateModal = (transactionTypeValue: string) => {
  transactionType.value = transactionTypeValue
  showCategoryModal.value = true
}

const onCategoryDelete = () => {
  showConfirmDialog.value = false
  showCategoryModal.value = false
  category.value = {}
  categoryStore.handleDeleteCategory(toDeleteId.value)
  toDeleteId.value = ''
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/categories.scss';
</style>
