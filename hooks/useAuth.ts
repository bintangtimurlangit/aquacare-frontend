import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';

export function useAuthSetup() {
  const { login } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [token, userJson] = await Promise.all([
          SecureStore.getItemAsync('token'),
          SecureStore.getItemAsync('user'),
        ]);

        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          await login(token, user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();
  }, []);
}
