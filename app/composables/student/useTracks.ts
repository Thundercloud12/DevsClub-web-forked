import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { trackSchema, type Track } from '~/schemas/tracks'

export const useTracks = () => {
  const db = getFirestore()

  const getTracks = async (): Promise<Track[]> => {
    const tracksRef = collection(db, 'Tracks')
    try {
      const snapshot = await getDocs(tracksRef)
      if (snapshot.empty) return []

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return trackSchema.parse({
          id: doc.id,
          name: data.name,
        })
      })
    } catch (err) {
      console.error('[useTracks] Error fetching tracks:', err)
      throw err
    }
  }

  return {
    getTracks,
  }
}
