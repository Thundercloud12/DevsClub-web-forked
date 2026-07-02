import { computed } from 'vue'
import { useColorMode } from '#imports'

export const useTheme = () => {
  const colorMode = useColorMode()

  // Computed property so it's globally reactive
  const isDark = computed(() => colorMode.value === 'dark')

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return { isDark, toggleTheme }
}
