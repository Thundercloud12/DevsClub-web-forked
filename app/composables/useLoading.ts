export const useLoading = () => {
  const loading = useState<boolean>('loading', () => false)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  return {
    loading,
    setLoading,
  }
}
