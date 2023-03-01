<template>
  <div>
    <h2>{{ CATEGORY_COPY.categories }}</h2>
    <button @click="() => (showCategoryModal = true)">
      {{ CATEGORY_COPY.addCategory }}
    </button>
    <div>
      <div v-for="{ name, id } in categories.categoryList" :key="id">
        <p>
          {{ name }}
        </p>
        <button :value="id" @click="onCategoryEdit">
          {{ CATEGORY_COPY.edit }}
        </button>
        <button :value="id" @click="onCategoryDelete">
          {{ CATEGORY_COPY.delete }}
        </button>
      </div>
    </div>

    <Modal :is-open="showCategoryModal" @close="onCloseCategoryModal">
      <CategoryForm :category="category" @close-modal="onCloseCategoryModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_COPY } from '~~/constants/copy'
import { useCategories } from '~~/stores/categories'
import { deleteCategory } from '~~/endpoints/category'
import CategoryForm from '~~/components/CategoryForm/index.vue'

const categories = useCategories()

const showCategoryModal = ref(false)
const category = ref({})

const onCloseCategoryModal = () => {
  showCategoryModal.value = false
  category.value = {}
}

const onCategoryEdit = async (event: Event) => {
  event.preventDefault()
  const categoryId = event.target.value as string
  const matchedCategory = categories.categoryList.find(
    ({ id }) => id === categoryId
  )

  if (matchedCategory) {
    category.value = matchedCategory
    showCategoryModal.value = true
  }
}
const onCategoryDelete = async (event: Event) => {
  event.preventDefault()
  const id = event.target.value as string
  await deleteCategory(id)

  categories.fetchCategories()
}
</script>
