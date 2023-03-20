<template>
  <div class="categories-container">
    <!-- EXPENSE CATEGORIES -->
    <div class="categories-transaction-type">
      <div class="card-stretch">
        <HeadingWithButton
          :heading="COPY.expenseCategories"
          :button-text="COPY.addCategory"
          @on-click="() => (showCategoryModal = true)"
        />

        <div class="category-cards">
          <CategoryCard
            v-for="item in categoryStore.expenseCategories"
            :key="item.id"
            :category="item"
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
      <div class="card-stretch">
        <HeadingWithButton
          :heading="COPY.incomeCategories"
          :button-text="COPY.addCategory"
          @on-click="() => (showCategoryModal = true)"
        />

        <div class="category-cards">
          <CategoryCard
            v-for="item in categoryStore.incomeCategories"
            :key="item.id"
            :category="item"
            @on-edit="onCategoryEdit"
            @on-delete="onShowConfirmDialog"
          />
        </div>
      </div>

      <div class="card category-chart-container">
        <Chart :options="incomeUsageOptions" />
      </div>
    </div>

    <!-- TRANSFER CATEGORIES -->
    <div class="categories-transaction-type">
      <div class="card-stretch">
        <HeadingWithButton
          :heading="COPY.transferCategories"
          :button-text="COPY.addCategory"
          @on-click="() => (showCategoryModal = true)"
        />

        <div class="category-cards">
          <CategoryCard
            v-for="item in categoryStore.transferCategories"
            :key="item.id"
            :category="item"
            @on-edit="onCategoryEdit"
            @on-delete="onShowConfirmDialog"
          />
        </div>
      </div>

      <div class="card category-chart-container">
        <Chart :options="transferUsageOptions" />
      </div>
    </div>

    <Modal :is-open="showCategoryModal" @close="onCloseCategoryModal">
      <CategoryForm
        :category="category"
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

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const categoryStore = useCategories()
const transactionStore = useTransactions()

const showCategoryModal = ref(false)
const category = ref({})
const showConfirmDialog = ref(false)
const toDeleteId = ref('')

const expenseUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoryUsage(
    transactionStore.expenses as Array<ITransaction>,
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

const transferUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoryUsage(
    transactionStore.transfers as Array<ITransaction>,
    COPY.transferUsage
  )
})

const onCloseCategoryModal = () => {
  showCategoryModal.value = false
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
