<template>
  <div>
    <div
      class="flex flex-col md:grid grid-cols-4 items-center justify-center h-[calc(100vh-56px)] md:h-[calc(100vh-96px)] mb-16 md:mb-0"
    >
      <div class="col-span-1 flex flex-col gap-8">
        <div class="flex flex-col gap-4 text-center md:text-left">
          <h2 class="font-bold text-[#05386B]">
            Take control of your finances today!
          </h2>
          <h3 class="font-medium text-[#05386B]">
            Sign up now for our powerful expense tracking app and embark on a
            journey towards financial freedom.
          </h3>
        </div>

        <NuxtLink
          class="button !border-transparent !bg-[#FF735D]"
          :to="PROFILE_REGISTER_ROUTE.path"
        >
          Get Started
        </NuxtLink>
      </div>

      <div class="col-span-3">
        <img
          src="https://res.cloudinary.com/darren-paul-photography/image/upload/v1684494708/expense-tracker/home_page_call_to_action_somnop.webp"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-20 mb-16">
      <div class="flex flex-col gap-8 text-center">
        <Budgeting />
        <div class="flex flex-col gap-2">
          <h3 class="text-[#05386B]">Budgeting Made Easy</h3>
          <p class="text-sm">
            Our budgeting feature allows you to set monthly, weekly or daily
            budgets for all your expenses. You can also categorize your spending
            to get a better understanding of where your money is going. With our
            app, you can easily keep track of your expenses and stick to your
            budget.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-4 text-center">
        <Saving />
        <div class="flex flex-col gap-2">
          <h3 class="text-[#05386B]">Set Saving Goals</h3>
          <p class="text-sm">
            Our budgeting feature allows you to set monthly, weekly or daily
            budgets for all your expenses. You can also categorize your spending
            to get a better understanding of where your money is going. With our
            app, you can easily keep track of your expenses and stick to your
            budget.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 text-center">
        <Transactions />
        <div class="flex flex-col gap-2">
          <h3 class="text-[#05386B]">Track Your Transactions</h3>
          <p class="text-sm">
            Our budgeting feature allows you to set monthly, weekly or daily
            budgets for all your expenses. You can also categorize your spending
            to get a better understanding of where your money is going. With our
            app, you can easily keep track of your expenses and stick to your
            budget.
          </p>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col gap-8 justify-center items-center h-auto md:h-[70vh] p-0 md:p-8 mb-16 md:mb-0"
    >
      <h3 class="text-[#05386B] text-center md:text-left">
        Our app is easy to use and accessible on all your devices. With our
        intuitive interface and powerful features, you can take control of your
        finances and achieve your financial goals. Sign up today and start
        managing your finances like a pro!
      </h3>

      <NuxtLink
        class="button !border-transparent !bg-[#FF735D] !w-full md:!w-fit px-0 md:!px-16"
        :to="PROFILE_REGISTER_ROUTE.path"
      >
        Get Started
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Budgeting from '~~/components/illustrations/Budgeting.vue'
import Saving from '~~/components/illustrations/Saving.vue'
import Transactions from '~~/components/illustrations/Transactions.vue'
import { PROFILE_REGISTER_ROUTE } from '~~/constants/routes/profile'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
