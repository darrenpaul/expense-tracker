<template>
  <li class="radio-button-container">
    <div class="radio-button">
      <input
        :id="elementId"
        v-model="radioValue"
        type="radio"
        :value="props.value"
        :name="elementName"
        @change="() => emit('change', radioValue)"
      />
      <label :for="elementId">
        {{ labelText }}
      </label>
    </div>
  </li>
</template>

<script setup lang="ts">
const emit = defineEmits(['change'])

const props = defineProps({
  elementId: { type: String, required: true },
  elementName: { type: String, required: true },
  value: { type: String, default: '' },
  selected: { type: String, default: '' },
  labelText: { type: String, default: '' },
  onChange: { type: Function, default: () => {} },
})

const radioValue = ref(props.selected)
</script>

<style lang="scss">
@import './basicRadio.scss';
</style>
