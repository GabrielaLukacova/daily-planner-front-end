import { ref } from 'vue'
import type { User } from '../../interfaces/interfaces'
import { state } from '../globalStates/state'
import { useRouter } from 'vue-router'

export const useUsers = () => {
  const router = useRouter()

  const token = ref<string | null>(localStorage.getItem('lsToken'))
  const error = ref<string | null>(null)
  const user = ref<User | null>(null)

  // === LOGIN ===
  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://daily-planner-kyar.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const authResponse = await response.json()

      if (!response.ok) {
        throw new Error(authResponse.error || 'Login failed')
      }

      token.value = authResponse.data.token
      user.value = authResponse.data.user
      state.isLoggedIn = true
      localStorage.setItem('lsToken', authResponse.data.token)

      console.log('✅ User logged in:', authResponse)
      router.push('/my-day')
    } catch (err) {
      error.value = (err as Error).message
      state.isLoggedIn = false
      console.error('❌ Login error:', error.value)
      throw err
    }
  }

  // === REGISTER ===
  const registerUser = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://daily-planner-kyar.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const authResponse = await response.json()

      if (!response.ok) {
        throw new Error(authResponse.error || 'Registration failed')
      }

      token.value = authResponse.data.token
      user.value = authResponse.data.user
      state.isLoggedIn = true
      localStorage.setItem('lsToken', authResponse.data.token)

      console.log('✅ User registered:', authResponse)
      router.push('/my-day')
    } catch (err) {
      error.value = (err as Error).message
      console.error('❌ Registration error:', error.value)
      throw err
    }
  }

  // === LOGOUT ===
  const logout = () => {
    token.value = null
    user.value = null
    state.isLoggedIn = false
    localStorage.removeItem('lsToken')

    console.log('👋 Logged out')
    router.push('/auth')
  }

  // === CHECK LOGIN STATUS ON PAGE LOAD ===
  const checkLoginStatus = () => {
    const storedToken = localStorage.getItem('lsToken')
    if (storedToken) {
      token.value = storedToken
      state.isLoggedIn = true
      console.log('✅ Already logged in')
    } else {
      state.isLoggedIn = false
      console.log('❌ Not logged in')
    }
  }

  return {
    token,
    error,
    user,
    isLoggedIn: state.isLoggedIn,
    fetchToken,
    registerUser,
    logout,
    checkLoginStatus,
  }
}