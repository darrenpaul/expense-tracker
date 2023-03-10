<template>
  <div class="dropdown-container">
    <div
      v-if="expanded"
      class="dropdown-click-close"
      @click="expanded = !expanded"
    />

    <div id="dropdown-input" class="dropdown-input" @click="dropdownClick">
      <div class="dropdown-tags">
        <button
          v-for="{ value, label } in selectionTags"
          :key="value"
          :value="value"
          class="dropdown-tag"
          @click="tagClick"
        >
          {{ label }}
        </button>
      </div>

      <div class="pointer-events-none">
        <ArrowDownIcon v-if="expanded" />
        <ArrowUpIcon v-else />
      </div>
    </div>

    <div v-if="expanded" class="dropdown-menu">
      <button
        v-for="{ value, label } in options"
        :key="value"
        :class="[
          'dropdown-item',
          isSelected(value) ? 'dropdown-item-active' : '',
        ]"
        :value="value"
        @click="dropdownItemClick"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'

const emit = defineEmits(['selectionUpdated'])

interface IOptions {
  value: string
  label: string
}
const props = defineProps({
  options: { type: Array<IOptions>, default: () => [] },
  selected: { type: String || Array<String>, default: '' },
  multiple: { type: Boolean, default: false },
})

const expanded = ref(false)
const selection = ref(props.selected)

const selectionTags = computed(() => {
  return props.options.filter(({ value }) => selection.value.includes(value))
})

const isSelected = (value: string) => {
  if (selection.value.includes(value)) {
    return true
  }
  return false
}

const dropdownClick = (event: Event) => {
  event.preventDefault()
  if (event.target?.id === 'dropdown-input') {
    expanded.value = !expanded.value
  }
}
const tagClick = (event: Event) => {
  event.preventDefault()
  const value = event.target?.value
  selection.value = selection.value.filter((x: string) => x !== value)
  emit('selectionUpdated', selection.value)
}

const dropdownItemClick = (event: Event) => {
  event.preventDefault()
  const value = event.target?.value
  if (props.multiple === true) {
    if (isSelected(value)) {
      selection.value = selection.value.filter((x: string) => x !== value)
    } else {
      selection.value = [...selection.value, value]
    }
  } else {
    selection.value = value
  }
  emit('selectionUpdated', selection.value)
}
</script>

<style lang="scss">
@import './dropdown.scss';
</style>
