import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AmountBillboardProps {
  amount: string;
  shakeTrigger?: number;
}

export function AmountBillboard({
  amount,
  shakeTrigger,
}: AmountBillboardProps) {
  const [whole, decimal] = amount.split(".");
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    if (shakeTrigger !== undefined) {
      shakeOffset.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [shakeTrigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  return (
    <View className="items-center justify-center py-4">
      <Animated.View className="flex-row items-baseline" style={animatedStyle}>
        <Text className="text-6xl font-bold text-foreground opacity-40 mr-2">
          +₹
        </Text>
        <Text className="text-8xl font-bold tracking-tight text-foreground">
          {whole}
        </Text>
        {decimal !== undefined && (
          <Text className="text-5xl font-medium tracking-tight text-foreground opacity-80">
            .{decimal}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
