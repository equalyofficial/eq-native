import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCSSVariable } from "uniwind";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

type QuickOption = "today" | "yesterday" | "custom";

function formatDateDisplay(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function getActiveOption(date: Date): QuickOption {
  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  return "custom";
}

function QuickDatePill({
  label,
  isActive,
  onPress,
  icon,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Feather>["name"];
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 12, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 200 });
  };

  const fgColor = useCSSVariable("--color-foreground");
  const bgColor = useCSSVariable("--color-background");

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={animatedStyle}
        className={isActive ? "flex-row items-center gap-2 rounded-full px-4 py-2.5 bg-foreground" : "flex-row items-center gap-2 rounded-full px-4 py-2.5 bg-card"}
      >
        {icon && (
          <Feather
            name={icon}
            size={14}
            color={isActive ? String(bgColor) : String(fgColor)}
          />
        )}
        <Text
          className={isActive ? "text-sm font-semibold text-background" : "text-sm font-semibold text-foreground"}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  const activeOption = getActiveOption(date);
  const [showPicker, setShowPicker] = useState(false);

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    onDateChange(yesterday);
  };

  const handlePickDate = () => {
    // For now, cycle through a few sample dates to demonstrate
    // In production, this would open a calendar bottom sheet
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    onDateChange(twoDaysAgo);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Feather
          name="calendar"
          size={16}
          color={String(useCSSVariable("--color-muted"))}
        />
        <Text className="text-sm font-semibold uppercase tracking-widest text-muted">
          Date
        </Text>
      </View>

      {/* Quick select pills */}
      <View className="flex-row gap-2">
        <QuickDatePill
          label="Today"
          isActive={activeOption === "today"}
          onPress={handleToday}
          icon="check"
        />
        <QuickDatePill
          label="Yesterday"
          isActive={activeOption === "yesterday"}
          onPress={handleYesterday}
        />
        <QuickDatePill
          label="Pick Date"
          isActive={activeOption === "custom"}
          onPress={handlePickDate}
          icon="chevron-down"
        />
      </View>

      {/* Formatted date display */}
      <Text className="text-sm text-muted">{formatDateDisplay(date)}</Text>
    </View>
  );
}
