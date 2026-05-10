import { defineStore } from 'pinia'

export const userTypes = {
  ADMIN: 'admin',
  HOD: 'hod',
  COMMITTEE: 'committee',
  STUDENT: 'student',
  PRINCIPAL: 'principal',
  RAILWAY: 'railway',
  PROFESSOR: 'professor',
  EXAMDEPT: 'examdept',
} as const

export type UserRole = (typeof userTypes)[keyof typeof userTypes]

export interface AuthUser {
  uid: string
  name: string
  email: string
  role: UserRole
}

interface UserState {
  user: AuthUser | null
  isHydrated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isHydrated: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,

    userRole: (state) => state.user?.role || null,
  },

  actions: {
    setUser(user: AuthUser) {
      this.user = user
    },

    clearUser() {
      this.user = null
    },

    setHydrated(value: boolean) {
      this.isHydrated = value
    },
  },
})
