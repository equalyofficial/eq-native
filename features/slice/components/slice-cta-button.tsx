import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCSSVariable } from "uniwind";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SliceCTAButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  isEnabled?: boolean;
}

export function SliceCTAButton({
  onPress,
  isLoading = false,
  isEnabled = true,
}: SliceCTAButtonProps) {
  const bgColor = String(useCSSVariable("--color-background"));
  const mutedColor = String(useCSSVariable("--color-muted"));

  const progress = useSharedValue(isEnabled ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(isEnabled ? 1 : 0, { duration: 200 });
  }, [isEnabled, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.97 + progress.value * 0.03 }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isLoading || !isEnabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isEnabled, busy: isLoading }}
      style={animatedStyle}
      className={`h-14 w-full flex-row items-center justify-center gap-2 rounded-full active:opacity-90 ${
        isEnabled ? "bg-foreground" : "bg-card"
      }`}
    >
      {isLoading ? (
        <ActivityIndicator color={bgColor} />
      ) : (
        <>
          <Text
            className={`text-lg font-semibold ${
              isEnabled ? "text-background" : "text-muted"
            }`}
          >
            Continue
          </Text>
          <Feather
            name="arrow-right"
            size={20}
            color={isEnabled ? bgColor : mutedColor}
          />
        </>
      )}
    </AnimatedPressable>
  );
}
