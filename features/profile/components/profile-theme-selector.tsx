import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  interpolateColor,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Uniwind, useUniwind } from "uniwind";
import type { ProfileThemeOption } from "../profile.data";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 220,
  mass: 0.9,
};

const options: {
  value: ProfileThemeOption;
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}[] = [
  {
    value: "light",
    label: "Light",
    icon: "sun",
  },
  {
    value: "dark",
    label: "Dark",
    icon: "moon",
  },
  {
    value: "system",
    label: "System",
    icon: "smartphone",
  },
];

function ThemeOption({
  index,
  option,
  progress,
  selected,
  onPress,
  isDark,
  segmentWidth,
}: {
  index: number;
  option: (typeof options)[number];
  progress: SharedValue<number>;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
  segmentWidth: number;
}) {
  const animatedContainerStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);

    return {
      transform: [
        {
          scale: interpolate(distance, [0, 1], [1, 0.975], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const animatedIconBadgeStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);

    return {
      opacity: interpolate(distance, [0, 1], [1, 0.82], Extrapolation.CLAMP),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);

    return {
      opacity: interpolate(distance, [0, 1], [1, 0.7], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="items-center justify-center"
      style={[
        animatedContainerStyle,
        {
          width: segmentWidth,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-center gap-2 rounded-full px-3 py-3"
        style={{ width: segmentWidth }}
      >
        <Animated.View
          className="items-center justify-center"
          style={animatedIconBadgeStyle}
        >
          <Feather
            name={option.icon}
            size={16}
            color={selected ? (isDark ? "#FFFFFF" : "#09090B") : "#71717A"}
          />
        </Animated.View>

        <Animated.View style={animatedTextStyle}>
          <Text
            className={[
              "text-center text-[0.92rem] font-semibold",
              selected ? "text-foreground" : "text-muted",
            ].join(" ")}
          >
            {option.label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function ProfileThemeSelector() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const resolvedTheme = useEffectiveColorScheme();
  const activeTheme: ProfileThemeOption = hasAdaptiveThemes ? "system" : theme;
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === activeTheme),
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const progress = useSharedValue(activeIndex);
  const gestureStart = useSharedValue(activeIndex);
  const isDark = resolvedTheme === "dark";
  // SharedValue so the Reanimated worklet always sees the latest isDark
  // without stale closure issues on the UI thread
  const isDarkSV = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(activeIndex, SPRING_CONFIG);
  }, [activeIndex, progress]);

  useEffect(() => {
    isDarkSV.value = withTiming(isDark ? 1 : 0, { duration: 200 });
  }, [isDark, isDarkSV]);

  const segmentWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  function setThemeByIndex(nextIndex: number) {
    const option = options[nextIndex];
    if (!option || activeTheme === option.value) {
      return;
    }

    Uniwind.setTheme(option.value);
  }

  const panGesture = Gesture.Pan()
    .enabled(segmentWidth > 0)
    .onBegin(() => {
      gestureStart.value = progress.value;
    })
    .onUpdate((event) => {
      if (segmentWidth <= 0) {
        return;
      }

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

      progress.value = withSpring(nextIndex, SPRING_CONFIG);
      runOnJS(setThemeByIndex)(nextIndex);
    });

  const indicatorStyle = useAnimatedStyle(() => {
    const lightColor = interpolateColor(
      progress.value,
      [0, 1, 2],
      ["rgba(255,255,255,0.96)", "rgba(255,255,255,0.92)", "rgba(255,255,255,0.96)"],
    );
    const darkColor = interpolateColor(
      progress.value,
      [0, 1, 2],
      ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.08)"],
    );
    return {
      transform: [{ translateX: segmentWidth * progress.value }],
      width: segmentWidth,
      backgroundColor: interpolateColor(
        isDarkSV.value,
        [0, 1],
        [lightColor, darkColor],
      ),
    };
  });

  function handleThemePress(optionValue: ProfileThemeOption) {
    if (activeTheme === optionValue) {
      return;
    }

    Uniwind.setTheme(optionValue);
  }

  return (
    <View className="rounded-4xl border border-border bg-card p-4">
      <Text className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted">
        Appearance
      </Text>
      <Text className="mt-2 text-xl font-bold text-foreground">Theme mood</Text>

      <GestureDetector gesture={panGesture}>
        <View
          className="mt-4 rounded-full p-1"
          style={{
            backgroundColor: isDark ? "#09090B" : "#F4F4F5",
            borderWidth: 1,
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E4E4E7",
          }}
          onLayout={(event) =>
            setContainerWidth(event.nativeEvent.layout.width - 8)
          }
        >
          {segmentWidth > 0 ? (
            <Animated.View
              pointerEvents="none"
              className="absolute bottom-1 left-1 top-1 rounded-full"
              style={[
                indicatorStyle,
                {
                  shadowColor: isDark ? "#000000" : "#0F172A",
                  shadowOpacity: isDark ? 0.18 : 0.07,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 4,
                },
              ]}
            />
          ) : null}

          <View className="flex-row">
            {options.map((option, index) => (
              <ThemeOption
                key={option.value}
                index={index}
                option={option}
                progress={progress}
                selected={activeTheme === option.value}
                isDark={isDark}
                segmentWidth={segmentWidth || 1}
                onPress={() => handleThemePress(option.value)}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
    </View>
  );
}
