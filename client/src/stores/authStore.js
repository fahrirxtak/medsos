import { create } from 'zustand' 
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(devtools((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthentication: !!localStorage.getItem('token'),

  setTokenData: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token: token, user: user, isAuthentication: true })
  },

  removeTokenData: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: "", user: "", isAuthentication: false })
  }

})))