<template>
  <div class="card-slim card-dark card-stretch category-card">
    <div>
      <component :is="iconForCategory" :fill="'var(--primary)'" :size="'32'" />
    </div>

    <div class="category-card-title-icon-group">
      <h3>{{ category.name }}</h3>
    </div>

    <div class="category-card-button-group">
      <button class="button-icon-secondary" @click="onDelete">
        <TrashIcon :fill="'var(--primary)'" />
      </button>

      <button class="button-icon" @click="onEdit"><PencilIcon /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICategory } from '~~/types/category'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { CATEGORY_ICONS } from '~~/constants/category'
import MissingCategoryIcon from '~~/components/icons/categories/MissingCategoryIcon.vue'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ category: ICategory }>()

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
