import { COMMON_COPY } from '~~/constants/copy'
import { useNotification } from '~~/stores/notification'

const notification = useNotification()

export const validateName = (
  name: string,
  message: string = COMMON_COPY.nameError
) => {
  if (name === '' || name === null || name === undefined) {
    notification.addNotification({
      message,
      type: 'error',
    })
    return false
  }
  return true
}

export const validateAmount = (amount: number) => {
  if (amount <= 0.0 || amount === null || amount === undefined) {
    notification.addNotification({
      message: COMMON_COPY.amountError,
      type: 'error',
    })
    return false
  }
  return true
}

export const validateUnique = (
  valueOne: string,
  valueTwo: string,
  message: string = COMMON_COPY.uniqueError
) => {
  if (valueOne === valueTwo) {
    notification.addNotification({
      message,
      type: 'error',
    })
    return false
  }
  return true
}
