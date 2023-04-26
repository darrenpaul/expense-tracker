<template>
  <div>
    <h3>Functionality</h3>
    <ul class="list-disc ml-6">
      <li v-for="(func, index) in functionality" :key="index">{{ func }}</li>
    </ul>

    <h3 class="mt-6">Bugs</h3>
    <ul class="list-disc ml-6">
      <li v-for="(bug, index) in bugs" :key="index">{{ bug }}</li>
    </ul>

    <h3 class="mt-6">Icons</h3>
    <ul class="list-disc ml-6">
      <li v-for="(icon, index) in icons" :key="index">{{ icon }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})

const functionality = ref([
  'Add option to remove the budget total amount from the balance on creation. This allows you to easily track your remaining money',
  'Add reoccurring transactions',
  'Add page where you can track all your subscriptions',
  'Add transaction filter, day, week(default), month, year, all, date, transaction type, account, amount range and category',
  'Display only this months transaction, and click to show more',
])

const bugs = ref(['Fix issue with date picker not start from selected date'])

const icons = ref([
  'Car (From side view)',
  'Motor Bike',
  'Bicycle',
  'Doctor/Hospital/Health Care',
  'Money Transfer Icon',
  'Clothing',
])
</script>
