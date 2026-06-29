import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { insights, type InsightItem } from "../home.data";

function InsightCard({ item, delay }: { item: InsightItem; delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 380 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 380 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animStyle}
      className="flex-1 rounded-2xl border border-border bg-card px-4 py-3"
    >
      <Feather name={item.icon} size={15} color="rgba(140,132,255,0.7)" />
      <Text className="mt-2 text-xl font-bold tracking-tight text-foreground">
        {item.value}
      </Text>
      <Text className="mt-0.5 text-xs font-medium text-muted" numberOfLines={1}>
        {item.label}
      </Text>
    </Animated.View>
  );
}

export function InsightsRow() {
  return (
    <View className="px-5 pt-6">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
        Overview
      </Text>
      <View className="flex-row gap-3">
        {insights.map((item, i) => (
          <InsightCard key={item.id} item={item} delay={i * 110} />
        ))}
      </View>
    </View>
  );
}
