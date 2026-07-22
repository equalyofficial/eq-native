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
import { useEffect, useState } from "react";
import { View } from "react-native";
import { AnimatedSplash } from "@/components/animated-splash";
import { queryClient } from "@/lib/query";
import { queryPersisterStorage } from "@/lib/storage";
import { useAuthStore } from "@/store/use-auth-store";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
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

const queryPersister = createSyncStoragePersister({
  storage: queryPersisterStorage,
});

// Keep the native splash up until fonts + the persisted session are ready.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const ready = (fontsLoaded || fontError) && hasHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(bgColor);
  }, [bgColor]);

  // Wait for fonts AND the persisted session to load before routing, so we
  // never flash the auth screen for an already-logged-in user.
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: 1000 * 60 * 60 * 24,
        }}
      >
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
      </PersistQueryClientProvider>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
    </GestureHandlerRootView>
  );
}
