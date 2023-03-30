import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'

export const initialSettings = { currency: 'ZAR', monthStart: 1 }

export const initialCategories = [
  {
    transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
    name: 'Groceries',
    icon: 'GroceryBagIcon',
  },
  {
    transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
    name: 'Petrol',
    icon: 'PetrolTankIcon',
  },
  {
    transactionType: TRANSACTION_TYPE_INCOME.displayName,
    name: 'Salary',
    icon: 'MoneyNotesIcon',
  },
]

export const initialAccounts = [
  {
    name: 'Cash',
    includeInBalance: true,
  },
  {
    name: 'Credit Card',
    includeInBalance: true,
  },
  {
    name: 'Savings',
    includeInBalance: true,
  },
]
