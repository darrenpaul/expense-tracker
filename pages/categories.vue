<template>
  <div>
    <div class="row between items-center my-4">
      <h2>{{ CATEGORY_COPY.categories }}</h2>

      <button
        class="button-secondary"
        @click="() => (showCategoryModal = true)"
      >
        {{ CATEGORY_COPY.addCategory }}
      </button>
    </div>

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
import { CATEGORY_COPY } from '~~/constants/copy'
import { useCategories } from '~~/stores/categories'
import CategoryForm from '~~/components/forms/CategoryForm.vue'
import CategoryCard from '~~/components/cards/CategoryCard.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import { ICategory, INewCategory } from '~~/types/category'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const categoryStore = useCategories()

const showCategoryModal = ref(false)
const category = ref({})
const showConfirmDialog = ref(false)
const toDeleteId = ref('')

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
