export const sumArrayNumbers = (numberArray: Array<number>) => {
  return numberArray.reduce((a, b) => a + b, 0)
}

interface IAverage {
  values: Array<number>
}
export const average = ({ values }: IAverage) => {
  const sumTotal = sumArrayNumbers(values)
  const arrayLength = values.length
  return sumTotal / arrayLength
}
