import { Image, Pressable } from "react-native";
import { router } from "expo-router";

export function TabProfileButton() {
  return (
    <Pressable
      onPress={() => router.push("/(protected)/profile")}
      className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card"
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      <Image
        source={{ uri: "https://i.pravatar.cc/160?img=19" }}
        className="h-full w-full"
      />
    </Pressable>
  );
}
