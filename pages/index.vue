<template>
  <div>
    <p>
      Welcome to our Expense Tracking App - the easiest way to manage your
      finances! With our app, you can easily track your expenses, set budgets,
      and achieve your savings goals. Whether you're trying to save up for a big
      purchase or simply want to get a better handle on your finances, our app
      is the perfect solution for you.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card flex flex-col gap-4">
        <Budgeting />
        <h2>Budgeting Made Easy</h2>
        <p>
          Our budgeting feature allows you to set monthly, weekly or daily
          budgets for all your expenses. You can also categorize your spending
          to get a better understanding of where your money is going. With our
          app, you can easily keep track of your expenses and stick to your
          budget.
        </p>
      </div>

      <div class="card flex flex-col gap-4">
        <Saving />
        <h2>Set Saving Goals</h2>
        <p>
          With our saving goals feature, you can set specific targets for
          yourself and work towards achieving them. Whether you're saving up for
          a vacation, a new car, or simply want to build up your emergency fund,
          our app makes it easy to stay on track and reach your goals.
        </p>
      </div>

      <div class="card flex flex-col gap-4">
        <Transactions />
        <h2>Track Your Transactions</h2>
        <p>
          Our transaction tracking feature lets you keep track of all your
          expenses and income in one place. You can easily view your spending
          history, see where your money is going, and track your progress
          towards your budget and savings goals.
        </p>
      </div>
    </div>
    <p>
      Our app is easy to use and accessible on all your devices. With our
      intuitive interface and powerful features, you can take control of your
      finances and achieve your financial goals. Sign up today and start
      managing your finances like a pro!
    </p>
  </div>
</template>

<script setup lang="ts">
import Budgeting from '~~/components/illustrations/Budgeting.vue'
import Saving from '~~/components/illustrations/Saving.vue'
import Transactions from '~~/components/illustrations/Transactions.vue'
</script>
