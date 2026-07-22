import { Pressable } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/use-auth-store";
import { UserAvatar } from "@/components/user-avatar";

export function TabProfileButton() {
  const user = useAuthStore((state) => state.user);

  return (
    <Pressable
      onPress={() => router.push("/(protected)/profile")}
      className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card"
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      <UserAvatar
        uri={user?.avatar_url}
        name={user?.name}
        textClassName="text-base font-bold text-foreground"
      />
    </Pressable>
  );
}
