import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/use-auth-store';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Redirect href={isAuthenticated ? '/(protected)/(tabs)' : '/(auth)/login'} />
  );
}
