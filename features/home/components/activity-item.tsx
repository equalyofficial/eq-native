import { Image, Text, View } from 'react-native';

import type { RecentActivityItem } from '../home.data';

export function ActivityItem({ item }: { item: RecentActivityItem }) {
  return (
    <View className="flex-row items-center">
      <View className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card">
        <Image source={{ uri: item.avatar }} className="h-full w-full" />
      </View>

      <View className="flex-1 px-4">
        <Text className="text-xl font-semibold tracking-tight text-foreground">{item.user}</Text>
        <Text className="mt-0.5 text-base text-zinc-300">{item.action}</Text>
      </View>

      <View className="items-end gap-1">
        <Text
          className={[
            'text-3xl font-bold tracking-tight',
            item.type === 'receive' ? 'text-emerald-400' : 'text-red-400',
          ].join(' ')}
        >
          {item.amount}
        </Text>
        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {item.time}
        </Text>
      </View>
    </View>
  );
}
