import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { recentActivity, type RecentActivityItem } from "../home.data";
import { ActivityItem } from "./activity-item";

export type RecentActivitySectionProps = {
  items?: RecentActivityItem[];
};

export function RecentActivitySection({
  items = recentActivity,
}: RecentActivitySectionProps) {
  return (
    <View className="px-5 pt-8">
      <View className="mb-5 flex-row items-end justify-between">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          Recent Activity
        </Text>
        <Pressable onPress={() => router.push("/activity")}>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            View All
          </Text>
        </Pressable>
      </View>

      <View>
        {items.map((item, index) => (
          <View key={item.id}>
            <ActivityItem item={item} index={index} />
            {index < items.length - 1 && <View className="h-2" />}
          </View>
        ))}
      </View>
    </View>
  );
}
