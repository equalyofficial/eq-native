import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { UserAvatar } from "@/components/user-avatar";
import type { ProfileUser } from "../profile.data";

export function ProfileIdentityCard({ user }: { user: ProfileUser }) {
  const mutedColor = useCSSVariable("--color-muted") as string;

  return (
    <View className="rounded-3xl border border-border bg-card px-5 py-5">
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center gap-4 pr-4">
          <View className="h-20 w-20 overflow-hidden rounded-2xl">
            <UserAvatar
              uri={user.avatar}
              name={user.name}
              textClassName="text-2xl font-bold text-foreground"
            />
          </View>

          <View className="flex-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {user.name}
            </Text>
            {user.phone ? (
              <Text className="mt-1 text-base font-medium text-foreground/85">
                {user.phone}
              </Text>
            ) : (
              <Text className="mt-1 text-base font-medium text-accent">
                Add mobile number
              </Text>
            )}
            {user.email ? (
              <Text className="mt-1 text-sm text-muted">{user.email}</Text>
            ) : null}
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

      <View className="rounded-2xl border border-border bg-background px-4 py-4">
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
