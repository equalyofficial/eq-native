import { Redirect, Stack } from "expo-router";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { useAuthStore } from "@/store/use-auth-store";

export default function ProtectedLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Guard: never render protected screens without a session.
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bgColor },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="expense-details"
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
