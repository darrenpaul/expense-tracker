<template>
  <div class="card-slim card-stretch row whitespace-nowrap centered between">
    <div class="row ml-2">
      <PetrolIcon />
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
import PetrolIcon from '~~/components/icons/categories/PetrolIcon.vue'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ category: ICategory }>()

const onEdit = () => {
  emit('onEdit', props.category.id)
}

const onDelete = () => {
  emit('onDelete', props.category.id)
}
</script>
