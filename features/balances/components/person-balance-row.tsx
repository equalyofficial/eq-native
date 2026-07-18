import { Image, Text, View } from "react-native";
import { BalanceAmount } from "./balance-amount";
import type { PersonBalance } from "../balances.data";

export function PersonBalanceRow({ person }: { person: PersonBalance }) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <View className="relative h-12 w-12">
        <View className="h-12 w-12 overflow-hidden rounded-full border border-border bg-background">
          <Image source={{ uri: person.avatar }} className="h-full w-full" />
        </View>
        {person.isOnline && (
          <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
        )}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {person.name}
        </Text>
        <Text className="mt-0.5 text-xs text-muted">{person.phone}</Text>
      </View>

      <BalanceAmount amount={person.amount} type={person.type} />
    </View>
  );
}
