import { userTypes, type UserRole } from '~/stores/user'

export const ROLE_CONFIG: Record<
  UserRole,
  {
    collection: string
    requiresTypeCheck: boolean
  }
> = {
  [userTypes.STUDENT]: {
    collection: 'Students ',
    requiresTypeCheck: false,
  },

  [userTypes.ADMIN]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.HOD]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.COMMITTEE]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.PRINCIPAL]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.RAILWAY]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.PROFESSOR]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },

  [userTypes.EXAMDEPT]: {
    collection: 'OfficialLogin',
    requiresTypeCheck: true,
  },
}
