<template>
  <div class="flex flex-row gap-4 justify-center">
    <DropDownButton
      :is-open="dropdownOpen"
      :button-text="categoryName"
      :button-style="'button-secondary'"
      @toggle-is-open="dropdownOpen = $event"
    >
      <template #dropdownButtons>
        <button
          :class="category === ALL ? 'button' : 'button-secondary'"
          :value="ALL"
          @click="() => onCategoryClick(ALL)"
        >
          All
        </button>

        <button
          v-for="{ id, name } in categoryStore.categories"
          :key="id"
          :class="['truncate', category === id ? 'button' : 'button-secondary']"
          :value="id"
          @click="() => onCategoryClick(id)"
        >
          {{ name }}
        </button>
      </template>
    </DropDownButton>
  </div>
</template>

<script setup lang="ts">
import DropDownButton from '~~/components/buttons/DropDownButton.vue'
import { ALL } from '~~/constants/stringTypes'
import { useCategories } from '~~/stores/categories'

const emit = defineEmits(['onChange'])

const props = defineProps({
  category: { type: String, required: true },
})

const categoryStore = useCategories()

const dropdownOpen = ref(false)

const categoryName = computed(() => {
  if (props.category === ALL) return ALL
  return categoryStore.categories.find(({ id }) => props.category === id)?.name
})

const onCategoryClick = (value: string) => {
  dropdownOpen.value = false
  emit('onChange', value)
}
</script>
