import { Stack } from "expo-router";

export default function ProtectedLayout() {
  // This is where you would handle authentication redirection in the future.
  // For now, it just serves as a layout for protected routes.
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
