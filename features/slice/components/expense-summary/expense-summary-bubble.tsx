import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { ALL_CATEGORIES } from "../../components/category-ribbon";

interface ExpenseSummaryBubbleProps {
  amount: string;
  category: string;
}

export function ExpenseSummaryBubble({
  amount,
  category,
}: ExpenseSummaryBubbleProps) {
  const fgColor = useCSSVariable("--color-foreground");
  const categoryData = ALL_CATEGORIES.find((c) => c.id === category);

  // Amount bubble scale-in animation
  const bubbleScale = useSharedValue(0.8);
  const bubbleOpacity = useSharedValue(0);

  // Category chip slide-up animation
  const chipTranslateY = useSharedValue(12);
  const chipOpacity = useSharedValue(0);

  useEffect(() => {
    // Bubble: scale in with spring
    bubbleScale.value = withSpring(1, { damping: 14, stiffness: 180 });
    bubbleOpacity.value = withTiming(1, { duration: 300 });

    // Category chip: delayed fade-in + slide-up
    chipTranslateY.value = withDelay(
      150,
      withSpring(0, { damping: 16, stiffness: 200 }),
    );
    chipOpacity.value = withDelay(150, withTiming(1, { duration: 250 }));
  }, []);

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleOpacity.value,
  }));

  const chipAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chipTranslateY.value }],
    opacity: chipOpacity.value,
  }));

  // Format amount with Indian numbering
  const formatDisplay = (val: string) => {
    const parts = val.split(".");
    parts[0] = new Intl.NumberFormat("en-IN").format(
      parseInt(parts[0] || "0", 10),
    );
    return parts.join(".");
  };

  const displayAmount = formatDisplay(amount);

  return (
    <View className="items-center gap-5">
      {/* Amount Bubble */}
      <Animated.View
        style={[styles.bubbleShadow, bubbleAnimatedStyle]}
        className="w-full items-center rounded-3xl border border-border bg-card px-6 py-10"
      >
        <View className="flex-row items-baseline">
          <Text
            className="mr-2 text-3xl font-bold text-foreground opacity-40"
          >
            +₹
          </Text>
          <Text className="text-6xl font-bold tracking-tighter text-foreground">
            {displayAmount.split(".")[0]}
          </Text>
          {displayAmount.includes(".") && (
            <Text className="text-3xl font-medium tracking-tighter text-foreground opacity-80">
              .{displayAmount.split(".")[1]}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Category Chip */}
      <Animated.View style={chipAnimatedStyle}>
        <View className="flex-row items-center gap-2 rounded-full bg-foreground px-5 py-2.5">
          <Text className="text-base leading-none">
            {categoryData?.icon ?? "📦"}
          </Text>
          <Text className="text-sm font-semibold text-background">
            {categoryData?.label ?? "Misc"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
});
