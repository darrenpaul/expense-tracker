<template>
  <div class="card-slim card-dark card-stretch category-card">
    <div class="category-card-title-icon-group">
      <template v-for="{ value, component } in CATEGORY_ICONS">
        <component
          :is="component"
          v-if="category.icon === value"
          :key="value"
          :fill="'var(--primary)'"
          :size="'24'"
        />
      </template>
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

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ category: ICategory }>()

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
