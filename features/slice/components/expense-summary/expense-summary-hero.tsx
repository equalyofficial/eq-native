import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface ExpenseSummaryHeroProps {
  amount: string;
}

function formatIndian(val: string): { intPart: string; decimalPart: string | null } {
  const num = parseFloat(val);
  const safe = isFinite(num) ? num : 0;
  const [rawInt, rawDec] = safe.toString().split(".");
  const intFormatted = new Intl.NumberFormat("en-IN").format(parseInt(rawInt ?? "0", 10));
  const decimalPart = rawDec && rawDec !== "00" && rawDec.length > 0 ? rawDec : null;
  return { intPart: intFormatted, decimalPart };
}

export function ExpenseSummaryHero({ amount }: ExpenseSummaryHeroProps) {
  const { intPart, decimalPart } = formatIndian(amount);

  return (
    <Animated.View entering={FadeIn.duration(280)} className="px-5 py-4">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Transaction Amount
      </Text>
      <View className="flex-row items-baseline gap-1">
        <Text className="text-3xl font-bold text-foreground opacity-40">₹</Text>
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          {intPart}
        </Text>
        {decimalPart !== null && (
          <Text className="text-2xl font-medium text-foreground opacity-60">
            .{decimalPart}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
