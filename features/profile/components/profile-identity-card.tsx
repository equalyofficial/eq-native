import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { ProfileUser } from "../profile.data";

export function ProfileIdentityCard({ user }: { user: ProfileUser }) {
  const mutedColor = useThemeColor({}, "muted");
  const borderColor = useThemeColor({}, "border");
  const innerPanelColor = useThemeColor({
    light: "#FFFFFF",
    dark: "#09090B",
  }, "background");

  return (
    <View className="rounded-[2rem] border border-border bg-card px-5 py-5">
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center gap-4 pr-4">
          <Image
            source={{ uri: user.avatar }}
            className="h-20 w-20 rounded-[1.5rem]"
          />

          <View className="flex-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {user.name}
            </Text>
            <Text className="mt-1 text-base font-medium text-foreground/85">
              {user.phone}
            </Text>
            <Text className="mt-1 text-sm text-muted">{user.email}</Text>
          </View>
        </View>

        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-background"
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Feather name="edit-2" size={16} color={mutedColor} />
        </Pressable>
      </View>

      <View
        className="rounded-[1.5rem] px-4 py-4"
        style={{
          borderWidth: 1,
          borderColor,
          backgroundColor: innerPanelColor,
        }}
      >
        <Text className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted">
          UPI ID
        </Text>
        <Text className="mt-2 text-lg font-bold tracking-tight text-foreground">
          {user.upiId ? user.upiId : "Please update your UPI ID"}
        </Text>
        {!user.upiId ? (
          <Text className="mt-1 text-sm text-muted">
            Add your UPI handle to make settlements faster and easier.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
