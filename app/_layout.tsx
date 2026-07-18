import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { View } from "react-native";
import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import * as SystemUI from "expo-system-ui";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { Toasts } from "@backpackapp-io/react-native-toast";
import "../global.css";

const StyledSafeAreaProvider = withUniwind(SafeAreaProvider);

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

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

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(bgColor);
  }, [bgColor]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <QueryClientProvider client={queryClient}>
        <StyledSafeAreaProvider initialMetrics={initialWindowMetrics}>
          <HeroUINativeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: bgColor },
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
            <Toasts
              defaultStyle={{
                view: {
                  backgroundColor: isDark ? "#ffffff" : "#000000",
                  borderRadius: 999,
                  paddingHorizontal: 20,
                },
                text: {
                  color: isDark ? "#000000" : "#ffffff",
                  fontFamily: "Outfit_500Medium",
                },
              }}
            />
          </HeroUINativeProvider>
        </StyledSafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
