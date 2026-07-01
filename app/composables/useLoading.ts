import { computed } from 'vue'

export const useLoading = () => {
  const activeLoaders = useState<Record<string, boolean>>(
    'activeLoaders',
    () => ({})
  )
  const loading = computed({
    get: () => Object.values(activeLoaders.value).some((v) => v === true),
    set: (val: boolean) => {
      activeLoaders.value['legacy'] = val
    },
  })

  const startLoading = (key: string) => {
    activeLoaders.value[key] = true
  }

  const stopLoading = (key: string) => {
    activeLoaders.value[key] = false
  }

  const setLoading = (value: boolean) => {
    activeLoaders.value['legacy'] = value
  }

  return {
    loading,
    startLoading,
    stopLoading,
    setLoading,
  }
}
