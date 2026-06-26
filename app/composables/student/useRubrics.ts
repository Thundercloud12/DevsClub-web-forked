import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { type Rubric } from '~/schemas/rubrics'

export const useRubrics = () => {
  const db = getFirestore()

  const getRubrics = async (): Promise<Rubric[]> => {
    const rubricsRef = collection(db, 'Rubrics')
    const snapshot = await getDocs(rubricsRef)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data() as Rubric)
  }

  return {
    getRubrics,
  }
}
