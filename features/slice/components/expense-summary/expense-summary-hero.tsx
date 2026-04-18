import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { ALL_CATEGORIES } from "../category-ribbon";

interface ExpenseSummaryHeroProps {
  amount: string;
  category: string;
}

function formatIndian(val: string): { intPart: string; decimalPart: string | null } {
  const num = parseFloat(val);
  const safe = isFinite(num) ? num : 0;
  const [rawInt, rawDec] = safe.toString().split(".");
  const intFormatted = new Intl.NumberFormat("en-IN").format(parseInt(rawInt ?? "0", 10));
  const decimalPart = rawDec && rawDec !== "00" && rawDec.length > 0 ? rawDec : null;
  return { intPart: intFormatted, decimalPart };
}

export function ExpenseSummaryHero({ amount, category }: ExpenseSummaryHeroProps) {
  const categoryData = ALL_CATEGORIES.find((c) => c.id === category);

  const heroScale = useSharedValue(0.88);
  const heroOpacity = useSharedValue(0);
  const chipTranslateY = useSharedValue(10);
  const chipOpacity = useSharedValue(0);

  useEffect(() => {
    heroScale.value = withSpring(1, { damping: 16, stiffness: 200 });
    heroOpacity.value = withTiming(1, { duration: 280 });
    chipTranslateY.value = withDelay(120, withSpring(0, { damping: 18, stiffness: 220 }));
    chipOpacity.value = withDelay(120, withTiming(1, { duration: 220 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
    opacity: heroOpacity.value,
  }));

  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chipTranslateY.value }],
    opacity: chipOpacity.value,
  }));

  const { intPart, decimalPart } = formatIndian(amount);

  return (
    <View className="items-center gap-4 py-8">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
        Transaction Amount
      </Text>

      <Animated.View style={heroStyle} className="flex-row items-baseline">
        <Text className="mr-1 text-3xl font-bold text-foreground opacity-40">₹</Text>
        <Text className="text-7xl font-bold tracking-tighter text-foreground">
          {intPart}
        </Text>
        {decimalPart !== null && (
          <Text className="text-4xl font-medium tracking-tight text-foreground opacity-70">
            .{decimalPart}
          </Text>
        )}
      </Animated.View>

      <Animated.View style={chipStyle}>
        <View className="flex-row items-center gap-2 rounded-full bg-foreground px-5 py-2">
          <Text className="text-base leading-none">{categoryData?.icon ?? "📦"}</Text>
          <Text className="text-sm font-semibold text-background">
            {categoryData?.label ?? "Misc"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
