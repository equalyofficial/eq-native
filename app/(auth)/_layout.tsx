import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
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
    </Stack>
  );
}
