import { Pressable, Text, View } from "react-native";
import type { BalanceType } from "../balances.data";

export function BalanceAmount({
  amount,
  type,
  onSettle,
}: {
  amount: string;
  type: BalanceType;
  onSettle?: () => void;
}) {
  if (type === "settled") {
    return (
      <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Settled
      </Text>
    );
  }

  const isReceive = type === "receive";

  return (
    <View className="items-end gap-2">
      <Text
        className={[
          "text-lg font-bold",
          isReceive ? "text-success" : "text-danger",
        ].join(" ")}
      >
        {isReceive ? "+" : "−"}
        {amount}
      </Text>
      <Pressable
        onPress={onSettle}
        className="rounded-full bg-linear-to-r from-zinc-100 to-brand-accent px-3 py-1.5 active:opacity-80"
      >
        <Text className="text-xs font-semibold uppercase tracking-wide text-white">
          Settle
        </Text>
      </Pressable>
    </View>
  );
}
