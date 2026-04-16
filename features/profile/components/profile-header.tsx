import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";

export function ProfileHeader() {
  const foregroundColor = useCSSVariable("--color-foreground");

  return (
    <View className="px-5 pt-3">
      <Pressable
        onPress={() => router.back()}
        className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="arrow-left" size={20} color={String(foregroundColor)} />
      </Pressable>
    </View>
  );
}
