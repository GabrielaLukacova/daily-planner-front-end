import { ref } from 'vue';
import type { User } from '../../interfaces/interfaces';
import { state } from '../globalStates/state';

export const useUsers = () => {
  const token = ref<string | null>(null);
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const name = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');

  // === LOGIN ===
  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://daily-planner-kyar.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const authResponse = await response.json();

      if (!response.ok) {
        throw new Error(authResponse.error || 'Login failed');
      }

      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      state.isLoggedIn = true;

      localStorage.setItem('lsToken', authResponse.data.token);
      localStorage.setItem('userIDToken', authResponse.data.userId);

      console.log('✅ User is logged in:', authResponse);
      console.log('🔐 Token:', token.value);
    } catch (err) {
      error.value = (err as Error).message || 'An error occurred';
      state.isLoggedIn = false;
      throw err; // Send videre til f.eks. AuthView.vue
    }
  };

  // === REGISTER ===
  const registerUser = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://daily-planner-kyar.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const authResponse = await response.json();

      if (!response.ok) {
        throw new Error(authResponse.error || 'Registration failed');
      }

      token.value = authResponse.data.token;
      user.value = authResponse.data.user;

      localStorage.setItem('lsToken', authResponse.data.token);
      console.log('✅ User is registered:', authResponse);
    } catch (err) {
      error.value = (err as Error).message || 'An error occurred during registration';
      throw err;
    }
  };

  // === LOGOUT ===
  const logout = () => {
    token.value = null;
    user.value = null;
    state.isLoggedIn = false;
    localStorage.removeItem('lsToken');
    localStorage.removeItem('userIDToken');
    console.log('👋 User is logged out');
  };

  return {
    token,
    isLoggedIn: state.isLoggedIn,
    error,
    user,
    name,
    email,
    password,
    fetchToken,
    registerUser,
    logout,
  };
};

