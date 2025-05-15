import { ref } from 'vue'
import type { User } from '../../interfaces/interfaces'
import { state } from '../globalStates/state'
import { useRouter } from 'vue-router'

export const useUsers = () => {
  const router = useRouter()

  const token = ref<string | null>(localStorage.getItem('lsToken'))
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const user = ref<User | null>(null)

  const name = ref<string>('')
  const email = ref<string>('')
  const password = ref<string>('')

  // === LOGIN ===
  const fetchToken = async (emailInput: string, passwordInput: string): Promise<void> => {
    try {
      console.log('🔁 Trying to log in...')

      const response = await fetch('https://daily-planner-kyar.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      })

      let authResponse
      try {
        authResponse = await response.json()
      } catch (jsonErr) {
        throw new Error('Server returned invalid JSON. This may be caused by a CORS or internal error.')
      }

      if (!response.ok) {
        throw new Error(authResponse.error || 'Login failed')
      }

      token.value = authResponse.data.token
      user.value = authResponse.data.user
      state.isLoggedIn = true
      localStorage.setItem('lsToken', authResponse.data.token)
      localStorage.setItem('userIDToken', authResponse.data.userId)

      console.log('✅ User logged in:', authResponse)
      router.push('/my-day')
    } catch (err) {
      const message = (err as Error).message || 'An error occurred during login'
      error.value = message
      state.isLoggedIn = false
      console.error('❌ Login error:', message)
      throw err
    }
  }

  // === REGISTER ===
  const registerUser = async (
    nameInput: string,
    emailInput: string,
    passwordInput: string
  ): Promise<boolean> => {
    try {
      console.log('🔁 Trying to register user...')

      if (nameInput.length < 6) {
        error.value = 'Name must be at least 6 characters long'
        successMessage.value = null
        console.warn('❌ Client-side validation failed:', error.value)
        return false
      }

      const response = await fetch('https://daily-planner-kyar.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, email: emailInput, password: passwordInput }),
      })

      let authResponse
      try {
        authResponse = await response.json()
      } catch (jsonErr) {
        throw new Error('Server returned invalid JSON. This may be caused by a CORS or internal error.')
      }

      console.log('🔍 Response status:', response.status)

      if (!response.ok) {
        error.value = authResponse.error || 'Registration failed'
        successMessage.value = null
        console.log('❌ Registration failed:', error.value)
        return false
      }

      // Clear input
      name.value = ''
      email.value = ''
      password.value = ''
      error.value = null
      successMessage.value = '🎉 Account successfully created! You can now log in.'

      console.log('✅ User registered:', authResponse)
      router.push('/auth')
      return true
    } catch (err) {
      const message = (err as Error).message || 'An error occurred during registration'
      error.value = message
      successMessage.value = null
      console.error('❌ Registration error:', message)
      return false
    }
  }

  // === LOGOUT ===
  const logout = () => {
    token.value = null
    user.value = null
    state.isLoggedIn = false
    localStorage.removeItem('lsToken')
    localStorage.removeItem('userIDToken')
    console.log('👋 Logged out')
    router.push('/auth')
  }

  // === CHECK LOGIN STATUS ===
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
    successMessage,
    user,
    name,
    email,
    password,
    isLoggedIn: state.isLoggedIn,
    fetchToken,
    registerUser,
    logout,
    checkLoginStatus,
  }
}
