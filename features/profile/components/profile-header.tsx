import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useUniwind } from "uniwind";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function ProfileHeader() {
  const systemColorScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();
  const resolvedTheme =
    hasAdaptiveThemes && systemColorScheme
      ? systemColorScheme
      : theme === "dark"
        ? "dark"
        : "light";
  const iconColor =
    resolvedTheme === "light" ? "#09090B" : "#FFFFFF";

  return (
    <View className="px-5 pt-3">
      <Pressable
        onPress={() => router.back()}
        className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="arrow-left" size={20} color={iconColor} />
      </Pressable>
    </View>
  );
}
