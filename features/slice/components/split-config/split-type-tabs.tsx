import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { SplitType } from "../../hooks/use-slice-flow-store";

const TABS: { id: SplitType; label: string }[] = [
  { id: "equal", label: "Equally" },
  { id: "percentage", label: "By %" },
  { id: "custom", label: "Custom" },
];

const SPRING = { damping: 20, stiffness: 320, mass: 0.7 };

interface SplitTypeTabsProps {
  splitType: SplitType;
  onSplitTypeChange: (type: SplitType) => void;
}

export function SplitTypeTabs({ splitType, onSplitTypeChange }: SplitTypeTabsProps) {
  const containerWidth = useSharedValue(0);
  const activeIndex = TABS.findIndex((t) => t.id === splitType);

  const pillStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth.value / TABS.length;
    return {
      width: tabWidth - 4,
      transform: [
        { translateX: withSpring(activeIndex * tabWidth + 2, SPRING) },
      ],
    };
  });

  return (
    <View
      className="flex-row rounded-full bg-card p-1"
      style={{ position: "relative" }}
      onLayout={(e) => {
        containerWidth.value = e.nativeEvent.layout.width;
      }}
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
