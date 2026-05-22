export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/under-maintenance') {
    return
  }

  const config = useRuntimeConfig()

  const projectId = config.public.FIREBASE_PROJECT_ID
  const apiKey = config.public.FIREBASE_API_KEY

  if (!projectId || !apiKey) {
    console.error('Missing Firebase config')
    return
  }

  try {
    const encodedPath = 'Maintainance/Web%20Maintenance'

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodedPath}?key=${apiKey}`

    const docSnap = await $fetch<{
      fields?: {
        underMaintenance?: {
          booleanValue?: boolean | string
        }
      }
    }>(url)

    const rawValue = docSnap?.fields?.underMaintenance?.booleanValue

    const isUnderMaintenance = rawValue === true || rawValue === 'true'

    if (isUnderMaintenance) {
      return navigateTo('/under-maintenance', {
        replace: true,
      })
    }
  } catch (error) {
    console.error('Maintenance check failed:', error)
    return
  }
})
