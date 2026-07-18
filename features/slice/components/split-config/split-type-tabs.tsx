import React, { useEffect } from "react";
import { View, Text, Pressable, type LayoutChangeEvent } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import type { SplitType } from "../../hooks/use-slice-flow-store";

const TABS: { id: SplitType; label: string }[] = [
  { id: "equal", label: "Equally" },
  { id: "percentage", label: "By %" },
  { id: "custom", label: "Custom" },
];

const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

interface SplitTypeTabsProps {
  splitType: SplitType;
  onSplitTypeChange: (type: SplitType) => void;
}

export function SplitTypeTabs({ splitType, onSplitTypeChange }: SplitTypeTabsProps) {
  const containerWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const hasMeasured = useSharedValue(false);
  const activeIndex = TABS.findIndex((t) => t.id === splitType);

  useEffect(() => {
    if (containerWidth.value > 0) {
      const tabWidth = containerWidth.value / TABS.length;
      translateX.value = withTiming(activeIndex * tabWidth + 2, TIMING);
    }
  }, [activeIndex, containerWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    width: containerWidth.value / TABS.length - 4,
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    containerWidth.value = width;
    if (!hasMeasured.value) {
      translateX.value = (activeIndex * width) / TABS.length + 2;
      hasMeasured.value = true;
    }
  };

  return (
    <View
      className="flex-row rounded-full bg-card p-1"
      style={{ position: "relative" }}
      onLayout={handleLayout}
    >
      {/* Sliding pill — absolutely positioned behind tab labels */}
      <Animated.View
        className="absolute top-1 bottom-1 rounded-full bg-foreground"
        style={pillStyle}
      />

      {TABS.map((tab) => {
        const isActive = splitType === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSplitTypeChange(tab.id);
            }}
            className="flex-1 items-center rounded-full py-2.5"
            style={{ zIndex: 1 }}
          >
            <Text
              className={
                isActive
                  ? "text-sm font-semibold text-background"
                  : "text-sm font-semibold text-muted"
              }
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
