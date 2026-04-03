import "../global.css";

import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaListener,
} from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { queryClient } from "@/lib/query";

SplashScreen.preventAutoHideAsync();
Uniwind.setTheme("system");

const EqualyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    border: "#e5e5e5",
    primary: "#000000",
  },
};

const EqualyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    card: "#000000",
    text: "#ffffff",
    border: "#1a1a1a",
    primary: "#ffffff",
  },
};

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useEffectiveColorScheme();
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

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets);
          }}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? EqualyDarkTheme : EqualyLightTheme}
          >
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar
              style={colorScheme === "dark" ? "light" : "dark"}
              // backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
            />
          </ThemeProvider>
        </SafeAreaListener>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
