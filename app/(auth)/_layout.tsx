import { Stack } from "expo-router";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function AuthLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: bgColor },
        }}
      >
        <Stack.Screen name="login" options={{ animation: "slide_from_left" }} />
        <Stack.Screen
          name="register"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="verify-otp"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
