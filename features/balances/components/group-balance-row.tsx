import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { BalanceAmount } from "./balance-amount";
import type { GroupBalance } from "../balances.data";

export function GroupBalanceRow({ group }: { group: GroupBalance }) {
  return (
    <Pressable
      onPress={() => router.push(`/group/${group.id}`)}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-card-deep">
        <Text style={{ fontSize: 24 }}>{group.emoji}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {group.name}
        </Text>
        <Text className="mt-0.5 text-xs text-muted">
          {group.memberCount} members
        </Text>
      </View>

      <BalanceAmount amount={group.amount} type={group.type} />
    </Pressable>
  );
}
