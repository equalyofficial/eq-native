import { router } from 'expo-router';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

import { balanceContacts } from '../home.data';

function PersonBalanceCard({
  name,
  amount,
  type,
  avatar,
}: {
  name: string;
  amount: string;
  type: 'receive' | 'owe';
  avatar: string;
}) {
  return (
    <Pressable className="mr-4 w-20 items-center">
      <View className="h-16 w-16 overflow-hidden rounded-full border border-border bg-card">
        <Image source={{ uri: avatar }} className="h-full w-full" />
      </View>
      <Text className="mt-3 text-sm font-semibold text-foreground">{name}</Text>
      <Text
        className={[
          'mt-1 text-xs font-semibold',
          type === 'receive' ? 'text-emerald-400' : 'text-red-400',
        ].join(' ')}
      >
        {amount}
      </Text>
    </Pressable>
  );
}

export function BalancePeopleRow() {
  return (
    <View className="px-5 pt-8">
      <View className="mb-5 flex-row items-end justify-between">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          People Balances
        </Text>
        <Pressable onPress={() => router.push('/friends')}>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            See All
          </Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={balanceContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PersonBalanceCard {...item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
