import { Pressable, Text, View } from 'react-native';

import { recentActivity } from '../home.data';
import { ActivityItem } from './activity-item';

export function RecentActivitySection() {
  return (
    <View className="px-5 pt-10">
      <View className="mb-6 flex-row items-end justify-between">
        <Text className="text-3xl font-bold tracking-tight text-foreground">Recent Activity</Text>
        <Pressable>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D9CDB7]">
            View All
          </Text>
        </Pressable>
      </View>

      <View className="gap-6">
        {recentActivity.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}
