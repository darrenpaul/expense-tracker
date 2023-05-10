interface IQuery {
  [key: string]: string
}
export const addQuery = (query: IQuery) => {
  useRouter().push({ query: { ...useRoute().query, ...query } })
}

export const clearQuery = () => {
  useRouter().replace({ query: {} })
}

export const removeQuery = (queryKey: string) => {
  const currentQuery = { ...useRoute().query }

  if (currentQuery[queryKey]) {
    delete currentQuery[queryKey]
    useRouter().replace({ query: currentQuery })
  }
}

export const hasQuery = (queryKey: string) => {
  return !!useRoute().query[queryKey]
}

export const getQuery = (queryKey: string) => {
  return useRoute().query[queryKey]
}
