import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { recentActivity, type RecentActivityItem } from '../home.data';
import { ActivityItem } from './activity-item';

export type RecentActivitySectionProps = {
  items?: RecentActivityItem[];
};

export function RecentActivitySection({
  items = recentActivity,
}: RecentActivitySectionProps) {
  return (
    <View className="flex-1 px-5 pt-10">
      <View className="mb-5 flex-row items-end justify-between">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          Recent Activity
        </Text>
        <Pressable onPress={() => router.push('/activity')}>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            View All
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityItem item={item} />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-6" />}
        contentContainerStyle={{ paddingBottom: 140 }}
      />
    </View>
  );
}
