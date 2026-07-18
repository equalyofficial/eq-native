import { Stack } from "expo-router";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

export default function ProtectedLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

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
