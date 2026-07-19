import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SPRING_CONFIG = { damping: 18, stiffness: 220, mass: 0.9 };

type Option<T extends string> = { value: T; label: string };

function SegmentLabel({
  index,
  label,
  selected,
  progress,
}: {
  index: number;
  label: string;
  selected: boolean;
  progress: SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    return {
      transform: [
        { scale: interpolate(distance, [0, 1], [1, 0.96], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(distance, [0, 1], [1, 0.72], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={animStyle}>
      <Text
        className={[
          "text-[0.9rem] font-semibold tracking-tight",
          selected ? "text-background" : "text-muted",
        ].join(" ")}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

export function SegmentToggle<T extends string>({
  options,
  value,
  onChange,
  compact,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = options.findIndex((o) => o.value === value);
  const progress = useSharedValue(activeIndex);
  const gestureStart = useSharedValue(activeIndex);

  const segmentWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  useEffect(() => {
    progress.value = withSpring(activeIndex, SPRING_CONFIG);
  }, [activeIndex, progress]);

  function setByIndex(nextIndex: number) {
    const option = options[nextIndex];
    if (option && option.value !== value) {
      onChange(option.value);
    }
  }

  const panGesture = Gesture.Pan()
    .enabled(segmentWidth > 0)
    .onBegin(() => {
      gestureStart.value = progress.value;
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
      const nextIndex = clamp(Math.round(progress.value), 0, options.length - 1);
      progress.value = withSpring(nextIndex, SPRING_CONFIG);
      scheduleOnRN(setByIndex, nextIndex);
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: segmentWidth * progress.value }],
    width: segmentWidth,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View
        className={[
          "rounded-full bg-card p-1",
          compact ? "h-9" : "h-12",
        ].join(" ")}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width - 8)}
      >
        {segmentWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            className="absolute bottom-1 left-1 top-1 rounded-full bg-foreground"
            style={indicatorStyle}
          />
        )}

        <View className="flex-1 flex-row">
          {options.map((option, index) => (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={{ width: segmentWidth || 1 }}
              className="h-full items-center justify-center"
            >
              <SegmentLabel
                index={index}
                label={option.label}
                selected={option.value === value}
                progress={progress}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
