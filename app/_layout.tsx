import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "../global.css";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();

  const resolvedTheme =
    hasAdaptiveThemes && systemColorScheme
      ? systemColorScheme
      : theme === "dark"
        ? "dark"
        : "light";
  const isDark = resolvedTheme === "dark";

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Imperatively sync status bar style on every theme change.
  // The declarative <StatusBar style> prop is unreliable on Android
  // after the component has already mounted.
  useEffect(() => {
    setStatusBarStyle(isDark ? "light" : "dark", true);
  }, [isDark]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <HeroUINativeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>

            <StatusBar animated />
          </HeroUINativeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
