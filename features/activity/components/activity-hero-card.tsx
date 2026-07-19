import { Text, View } from "react-native";

export function ActivityHeroCard({ amount }: { amount: string }) {
  const symbol = amount.slice(0, 1);
  const value = amount.slice(1);

  return (
    <View className="justify-center overflow-hidden" style={{ height: 100 }}>
      <Text
        pointerEvents="none"
        className="absolute font-bold text-foreground"
        style={{ fontSize: 104, opacity: 0.14, letterSpacing: 6, bottom: -10, left: 30 }}
      >
        FEED
      </Text>

      <Text className="text-5xl font-bold tracking-tight text-foreground">
        <Text className="text-accent">{symbol}</Text>
        {value}
      </Text>
      <Text className="mt-1 text-xs text-muted">Net movement this month</Text>
    </View>
  );
}
