<template>
  <div>
    <div class="card-half">
      <Chart :options="categoryUsageOptions" />
    </div>

    <HeadingWithButton
      :heading="CATEGORY_COPY.categories"
      :button-text="CATEGORY_COPY.addCategory"
      @on-click="() => (showCategoryModal = true)"
    />

    <div class="row between items-center my-4">
      <h3>{{ CATEGORY_COPY.expenseCategories }}</h3>
    </div>
    <div class="grid-3-col">
      <CategoryCard
        v-for="item in categoryStore.expenseCategories"
        :key="item.id"
        :category="item"
        @on-edit="onCategoryEdit"
        @on-delete="onShowConfirmDialog"
      />
    </div>

    <div class="row between items-center my-4">
      <h3>{{ CATEGORY_COPY.incomeCategories }}</h3>
    </div>
    <div class="grid-3-col">
      <CategoryCard
        v-for="item in categoryStore.incomeCategories"
        :key="item.id"
        :category="item"
        @on-edit="onCategoryEdit"
        @on-delete="onShowConfirmDialog"
      />
    </div>

    <div class="row between items-center my-4">
      <h3>{{ CATEGORY_COPY.transferCategories }}</h3>
    </div>
    <div class="grid-3-col">
      <CategoryCard
        v-for="item in categoryStore.transferCategories"
        :key="item.id"
        :category="item"
        @on-edit="onCategoryEdit"
        @on-delete="onShowConfirmDialog"
      />
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
import { CATEGORY_COPY } from '~~/constants/copy'
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

const categoryUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoryUsage(transactionStore.list as Array<ITransaction>)
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
}
</script>
