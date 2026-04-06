import { Redirect } from 'expo-router';

import RegisterScreen from '@/features/auth/screens/register-screen';
import { useAuthStore } from '@/store/use-auth-store';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <RegisterScreen />;
}
