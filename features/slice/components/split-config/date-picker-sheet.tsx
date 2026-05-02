import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  type LayoutChangeEvent,
  Keyboard,
} from "react-native";
import { BottomSheet } from "heroui-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeOut,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { AppToast } from "@/lib/toast";

interface DatePickerSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onDateChange: (date: Date) => void;
}

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
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

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildGrid(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DatePickerSheet({
  isOpen,
  onOpenChange,
  date,
  onDateChange,
}: DatePickerSheetProps) {
  // ── All hooks at the top — no conditional calls ──────────────────────────
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000000");

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todaySelected = sameDay(date, today);
  const yesterdaySelected = sameDay(date, yesterday);

  const [viewYear, setViewYear] = useState(() => date.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => date.getMonth());
  const [slideDir, setSlideDir] = useState<1 | -1>(1);

  // Sliding pill shared values
  const containerW = useSharedValue(0);
  const hasMeasured = useRef(false);
  // 0 = Today slot, 1 = Yesterday slot
  const pillIdx = useSharedValue(todaySelected ? 0 : 1);
  // Always start hidden — fade in after containerW is measured to avoid snap jitter
  const pillOpacity = useSharedValue(0);
  // Shake offset for future-month rejection
  const shakeX = useSharedValue(0);

  const pillStyle = useAnimatedStyle(() => ({
    width: containerW.value / 2,
    transform: [{ translateX: pillIdx.value * (containerW.value / 2) }],
    opacity: pillOpacity.value,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // ── Helpers ───────────────────────────────────────────────────────────────
  const grid = buildGrid(viewYear, viewMonth);
  const rows = Math.ceil(grid.length / 7);

  const isNextMonthFuture =
    new Date(viewYear, viewMonth + 1, 1) >
    new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    containerW.value = e.nativeEvent.layout.width - 12;
    if (!hasMeasured.current) {
      hasMeasured.current = true;
      if (todaySelected || yesterdaySelected) {
        pillOpacity.value = withTiming(1, { duration: 150 });
      }
    }
  };

  const easeConfig = { duration: 220, easing: Easing.inOut(Easing.cubic) };

  const selectQuick = (d: Date, idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pillIdx.value = withTiming(idx, easeConfig);
    pillOpacity.value = withTiming(1, { duration: 180 });
    onDateChange(d);
    setTimeout(() => onOpenChange(false), 240);
  };

  const selectCalendarDate = (d: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pillOpacity.value = withTiming(0, { duration: 180 });
    onDateChange(d);
    onOpenChange(false);
  };

  const prevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSlideDir(-1);
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSlideDir(1);
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const rejectFuture = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    AppToast.error("Can't add an expense for a future date");
    shakeX.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(8, { duration: 45 }),
      withTiming(-6, { duration: 45 }),
      withTiming(6, { duration: 45 }),
      withTiming(-3, { duration: 45 }),
      withTiming(0, { duration: 45 }),
    );
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-10, 10])
    .onEnd((event) => {
      if (event.translationX < -30) {
        if (isNextMonthFuture) {
          scheduleOnRN(rejectFuture);
        } else {
          scheduleOnRN(nextMonth);
        }
      } else if (event.translationX > 30) {
        scheduleOnRN(prevMonth);
      }
    });

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay
          onPress={() => {
            Keyboard.dismiss();
            onOpenChange(false);
          }}
        />
        <BottomSheet.Content
          backgroundClassName="rounded-t-[2rem] bg-background"
          contentContainerClassName="pt-2 pb-0"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
            <View>
              <Text className="text-2xl font-bold tracking-tight text-foreground">
                When was this?
              </Text>
              <Text className="mt-0.5 text-sm text-muted">
                Select the expense date
              </Text>
            </View>
            <Pressable
              onPress={() => onOpenChange(false)}
              className="h-10 w-10 items-center justify-center rounded-full bg-card active:opacity-70"
            >
              <Feather name="x" size={18} color={fgColor} />
            </Pressable>
          </View>

          <View className="gap-6 px-5 pb-10">
            {/* Segmented pill — Today / Yesterday */}
            <View
              className="flex-row rounded-full bg-card p-1.5"
              onLayout={handleContainerLayout}
            >
              {/* Sliding background pill */}
              <Animated.View
                style={pillStyle}
                className="absolute bottom-1.5 top-1.5 rounded-full bg-foreground"
                pointerEvents="none"
              />

              {/* Today */}
              <Pressable
                onPress={() => selectQuick(new Date(), 0)}
                className="flex-1 items-center py-3.5"
              >
                <Text
                  className={
                    todaySelected
                      ? "text-base font-semibold text-background"
                      : "text-base font-semibold text-foreground"
                  }
                >
                  Today
                </Text>
              </Pressable>

              {/* Yesterday */}
              <Pressable
                onPress={() => selectQuick(yesterday, 1)}
                className="flex-1 items-center py-3.5"
              >
                <Text
                  className={
                    yesterdaySelected
                      ? "text-base font-semibold text-background"
                      : "text-base font-semibold text-foreground"
                  }
                >
                  Yesterday
                </Text>
              </Pressable>
            </View>

            {/* Divider with label */}
            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Or pick a date
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            {/* Swipeable calendar area — month nav + weekdays + grid */}
            <GestureDetector gesture={swipeGesture}>
              <Animated.View style={shakeStyle} className="gap-6">
                {/* Month navigation */}
                <View className="flex-row items-center justify-between">
                  <Pressable
                    onPress={prevMonth}
                    className="h-10 w-10 items-center justify-center rounded-full bg-card active:opacity-70"
                  >
                    <Feather name="chevron-left" size={20} color={fgColor} />
                  </Pressable>
                  <Text className="text-lg font-bold tracking-tight text-foreground">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </Text>
                  <Pressable
                    onPress={isNextMonthFuture ? rejectFuture : nextMonth}
                    className={
                      isNextMonthFuture
                        ? "h-10 w-10 items-center justify-center rounded-full bg-card opacity-25"
                        : "h-10 w-10 items-center justify-center rounded-full bg-card active:opacity-70"
                    }
                  >
                    <Feather name="chevron-right" size={20} color={fgColor} />
                  </Pressable>
                </View>

                {/* Weekday headers */}
                <View className="flex-row">
                  {WEEK_DAYS.map((d) => (
                    <View key={d} className="flex-1 items-center">
                      <Text className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
                        {d}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Calendar grid — slides in/out on month change */}
                <Animated.View
                  key={`${viewYear}-${viewMonth}`}
                  entering={
                    slideDir > 0
                      ? SlideInRight.duration(280).easing(Easing.out(Easing.cubic))
                      : SlideInLeft.duration(280).easing(Easing.out(Easing.cubic))
                  }
                  exiting={FadeOut.duration(120)}
                  className="gap-1"
                >
                  {Array.from({ length: rows }, (_, row) => (
                    <View key={row} className="flex-row">
                      {grid.slice(row * 7, row * 7 + 7).map((day, col) => {
                        if (!day) {
                          return <View key={col} className="flex-1" />;
                        }
                        const cellDate = new Date(viewYear, viewMonth, day);
                        const isFuture =
                          cellDate > today && !sameDay(cellDate, today);
                        const isSelected = sameDay(cellDate, date);
                        const isTodayCell = sameDay(cellDate, today);

                        return (
                          <Pressable
                            key={col}
                            onPress={
                              isFuture
                                ? undefined
                                : () => selectCalendarDate(cellDate)
                            }
                            disabled={isFuture}
                            className="flex-1 items-center py-0.5"
                          >
                            <View
                              className={
                                isSelected
                                  ? "h-10 w-10 items-center justify-center rounded-full bg-foreground"
                                  : isTodayCell
                                    ? "h-10 w-10 items-center justify-center rounded-full border border-foreground/20"
                                    : "h-10 w-10 items-center justify-center rounded-full"
                              }
                            >
                              <Text
                                className={
                                  isSelected
                                    ? "text-base font-bold text-background"
                                    : isTodayCell
                                      ? "text-base font-bold text-primary"
                                      : isFuture
                                        ? "text-base text-muted"
                                        : "text-base text-foreground"
                                }
                              >
                                {day}
                              </Text>
                            </View>
                            {/* Today dot */}
                            {isTodayCell && !isSelected && (
                              <View className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
