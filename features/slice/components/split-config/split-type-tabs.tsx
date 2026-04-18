import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import type { SplitType } from "../../hooks/use-slice-flow-store";

const TABS: { id: SplitType; label: string }[] = [
  { id: "equal", label: "Equally" },
  { id: "percentage", label: "By %" },
  { id: "custom", label: "Custom" },
];

interface SplitTypeTabsProps {
  splitType: SplitType;
  onSplitTypeChange: (type: SplitType) => void;
}

export function SplitTypeTabs({ splitType, onSplitTypeChange }: SplitTypeTabsProps) {
  return (
    <View className="flex-row rounded-full bg-card p-1">
      {TABS.map((tab) => {
        const isActive = splitType === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSplitTypeChange(tab.id);
            }}
            className={`flex-1 items-center rounded-full py-2.5 ${
              isActive ? "bg-foreground" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-background" : "text-muted"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
