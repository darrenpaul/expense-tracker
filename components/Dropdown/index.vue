<template>
  <div class="dropdown-container">
    <!-- CLICK AND CLOSE BACKGROUND -->
    <div
      v-if="expanded"
      class="dropdown-click-close"
      @click="expanded = !expanded"
    />

    <!-- INPUT -->
    <div id="dropdown-input" class="dropdown-input" @click="dropdownClick">
      <template v-if="optionsAreComponents === true">
        <template v-for="{ value, component } in options">
          <component
            :is="component"
            v-if="selected === value"
            :key="value"
            :fill="'var(--primary)'"
            :size="'24'"
          />
        </template>

        <p v-if="!selected"></p>
      </template>

      <template v-if="optionsAreComponents === false">
        <div v-if="multiple === true" class="dropdown-tags">
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

        <div v-if="multiple === false">
          <p class="dropdown-text">{{ singleLabelText }}</p>
        </div>
      </template>

      <div class="pointer-events-none mr-2">
        <ArrowDownIcon v-if="expanded" :size="'12'" />
        <ArrowUpIcon v-else :size="'12'" />
      </div>
    </div>

    <!-- MENU -->
    <div
      v-if="expanded"
      :class="[
        optionsAreComponents ? 'dropdown-menu-components' : 'dropdown-menu',
      ]"
    >
      <template v-if="optionsAreComponents === true">
        <button
          v-for="{ value, component } in options"
          :key="value"
          :class="[
            'dropdown-item',
            isSelected(value) ? 'dropdown-item-active' : '',
          ]"
          :value="value"
          @click="() => dropdownItemClick(value)"
        >
          <component :is="component" :fill="'var(--primary)'" :size="'42'" />
        </button>
      </template>

      <template v-if="optionsAreComponents === false">
        <button
          v-for="{ value, label } in options"
          :key="value"
          :class="[
            'dropdown-item',
            isSelected(value) ? 'dropdown-item-active' : '',
          ]"
          :value="value"
          @click="() => dropdownItemClick(value)"
        >
          {{ label }}
        </button>
      </template>
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
  component?: any
}
const props = defineProps({
  options: { type: Array<IOptions>, default: () => [] },
  selected: { type: String || Array<String>, default: '' },
  multiple: { type: Boolean, default: false },
  optionsAreComponents: { type: Boolean, default: false },
})

const expanded = ref(false)
const selection = ref(props.selected)

const selectionTags = computed(() => {
  return props.options.filter(({ value }) => selection.value.includes(value))
})

const singleLabelText = computed(() => {
  return props.options.find(({ value }) => selection.value.includes(value))
    ?.label
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

const dropdownItemClick = (value) => {
  if (props.multiple === true) {
    if (isSelected(value)) {
      selection.value = selection.value.filter((x: string) => x !== value)
    } else {
      selection.value = [...selection.value, value]
    }
  } else {
    selection.value = value
    expanded.value = false
  }
  emit('selectionUpdated', selection.value)
}
</script>

<style lang="scss">
@import './dropdown.scss';
</style>
