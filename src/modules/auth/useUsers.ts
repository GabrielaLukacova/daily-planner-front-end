import { ref } from 'vue';
import type { User } from '../../interfaces/interfaces';
import { state } from '../globalStates/state';

export const useUsers = () => {
  // Global auth state
  const token = ref<string | null>(null);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const user = ref<User | null>(null);

  // Form input bindings
  const name = ref<string>('');      
  const email = ref<string>('');    
  const password = ref<string>(''); 

  // === LOGIN FUNCTION ===
  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔁 Trying to log in...');
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
      error.value = (err as Error).message || 'An error occurred during login';
      state.isLoggedIn = false;
      throw err;
    }
  };

  // === REGISTER FUNCTION ===
  const registerUser = async (nameInput: string, emailInput: string, passwordInput: string): Promise<void> => {
    try {
      console.log('🔁 Trying to register user...');
      const response = await fetch('https://daily-planner-kyar.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput, email: emailInput, password: passwordInput }),
      });

      const authResponse = await response.json();

      if (!response.ok) {
        // Display readable validation feedback
        error.value = authResponse.error || 'Registration failed';
        successMessage.value = null;
        console.log('❌ Registration failed:', error.value);
        return;
      }

      // Registration successful
      successMessage.value = '🎉 Account successfully created! You can now log in.';
      error.value = null;

      // Clear input fields
      name.value = '';
      email.value = '';
      password.value = '';

      console.log('✅ User is registered:', authResponse);
    } catch (err) {
      error.value = (err as Error).message || 'An error occurred during registration';
      successMessage.value = null;
      throw err;
    }
  };

  // === LOGOUT FUNCTION ===
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
    successMessage,
    user,
    name,
    email,
    password,
    fetchToken,
    registerUser,
    logout,
  };
};
