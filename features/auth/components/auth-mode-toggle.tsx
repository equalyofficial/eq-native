import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useCSSVariable } from "uniwind";

type Option = {
  value: string;
  label: string;
};

type AuthModeToggleProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function AuthModeToggle({
  options,
  value,
  onChange,
}: AuthModeToggleProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const accentColor = useCSSVariable("--color-accent") as string;
  const progress = useSharedValue(options.findIndex((o) => o.value === value));
  const isDragging = useSharedValue(0); // 0 for idle, 1 for dragging
  const gestureStart = useSharedValue(0);

  const segmentWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  useEffect(() => {
    progress.value = withTiming(
      options.findIndex((o) => o.value === value),
      {
        duration: 200,
      },
    );
  }, [value, options]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      gestureStart.value = progress.value;
      isDragging.value = withTiming(1, { duration: 100 });
    })
    .onUpdate((event) => {
      if (segmentWidth <= 0) return;
      progress.value = clamp(
        gestureStart.value + event.translationX / segmentWidth,
        0,
        options.length - 1,
      );
    })
    .onEnd(() => {
      const nextIndex = clamp(
        Math.round(progress.value),
        0,
        options.length - 1,
      );
      progress.value = withTiming(nextIndex, { duration: 200 });
      isDragging.value = withTiming(0, { duration: 100 });
      scheduleOnRN(onChange, options[nextIndex].value);
    });

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: segmentWidth * progress.value }],
      width: segmentWidth,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        className="mt-4 rounded-full p-1 bg-card border border-border w-64 self-center relative overflow-hidden"
        onLayout={(event) =>
          setContainerWidth(event.nativeEvent.layout.width - 8)
        }
      >
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              indicatorStyle,
              {
                position: "absolute",
                left: 4,
                top: 4,
                bottom: 4,
                borderRadius: 999,
                zIndex: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
            className="bg-accent/30"
          />
        )}
        <View className="flex-row relative z-10">
          {options.map((option, index) => (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className="flex-1 py-2 rounded-full items-center justify-center"
            >
              <Text
                className={[
                  "text-xs font-bold uppercase tracking-wider",
                  value === option.value ? "text-foreground" : "text-muted",
                ].join(" ")}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
