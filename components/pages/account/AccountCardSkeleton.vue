<template>
  <div class="card card-stretch account-card">
    <div class="account-card-title-amount-group">
      <div
        class="w-40 h-7 bg-neutral-200 rounded-full animate-pulse mb-2 md:mb-0"
      ></div>
      <div class="w-40 h-7 bg-neutral-200 rounded-full animate-pulse"></div>
    </div>

    <div class="account-card-expense-income-group gap-8 h-12 animate-pulse">
      <div class="w-1/2 flex flex-col gap-1">
        <div class="w-full h-6 bg-neutral-200 rounded-full animate-pulse" />
        <div class="w-3/4 h-6 bg-neutral-200 rounded-full animate-pulse" />
      </div>
      <div class="w-1/2 flex flex-col gap-1">
        <div class="w-full h-6 bg-neutral-200 rounded-full animate-pulse" />
        <div class="w-3/4 h-6 bg-neutral-200 rounded-full animate-pulse" />
      </div>
    </div>

    <div class="account-card-button-group">
      <div class="w-full h-10 bg-neutral-200 rounded-lg animate-pulse mb-2" />
      <div class="w-full h-10 bg-neutral-200 rounded-lg animate-pulse mb-2" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import './cards.scss';
</style>
