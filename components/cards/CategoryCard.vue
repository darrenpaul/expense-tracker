<template>
  <div class="card-slim card-stretch row whitespace-nowrap centered between">
    <div class="row ml-2">
      <template v-for="{ value, component } in CATEGORY_ICONS">
        <component
          :is="component"
          v-if="category.icon === value"
          :key="value"
          :fill="'var(--primary)'"
          :size="'24'"
        />
      </template>
      <p>{{ category.name }}</p>
    </div>

    <div class="row">
      <button class="button-icon" @click="onEdit"><PencilIcon /></button>
      <button class="button-icon-danger" @click="onDelete">
        <TrashIcon />
      </button>
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
