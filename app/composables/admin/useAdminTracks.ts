import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import { trackSchema, type Track } from '~/schemas/tracks'
import { useAuthStore } from '~/stores/auth'

export const useAdminTracks = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const createTrack = async (data: any) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage tracks.')
    }

    const validatedData = trackSchema.parse(data)
    const trackRef = doc(db, 'Tracks', validatedData.id)
    await setDoc(trackRef, validatedData)
    return validatedData
  }

  const deleteTrack = async (id: string) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage tracks.')
    }

    const trackRef = doc(db, 'Tracks', id)
    await deleteDoc(trackRef)
  }

  const getAdminTracks = async (): Promise<Track[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access tracks.')
    }

    const tracksRef = collection(db, 'Tracks')
    const snapshot = await getDocs(tracksRef)
    if (snapshot.empty) return []

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || '',
      } as Track
    })
  }

  return {
    createTrack,
    deleteTrack,
    getAdminTracks,
  }
}
