<template>
  <div>
    <h2>{{ CATEGORY_COPY.categories }}</h2>

    <div>
      <div v-for="category in categories.categoryList" :key="category.id">
        <p>
          {{ category.displayName }}
        </p>
        <button>{{ CATEGORY_COPY.edit }}</button>
        <button>{{ CATEGORY_COPY.delete }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_COPY } from '~~/constants/copy'
import { useCategories } from '~~/stores/categories'

const categories = useCategories()
</script>
