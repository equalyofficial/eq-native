import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { useUniwind, useCSSVariable } from "uniwind";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type VisibleRouteName = "index" | "groups" | "slice" | "friends" | "activity";
const AnimatedFeather = Animated.createAnimatedComponent(Feather);

const TAB_SPACING = 76;
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 220,
  mass: 0.9,
};

const tabMeta: Record<
  VisibleRouteName,
  {
    iconName: React.ComponentProps<typeof Feather>["name"];
    label: string;
  }
> = {
  index: { iconName: "home", label: "Home" },
  groups: { iconName: "users", label: "Groups" },
  slice: { iconName: "plus", label: "Slice" },
  friends: { iconName: "user", label: "Friends" },
  activity: { iconName: "bell", label: "Activity" },
};

function triggerSelectionHaptic() {
  void Haptics.selectionAsync();
}

function DraggableTabItem({
  itemIndex,
  focusPosition,
  iconName,
  onPress,
  isDark,
  centerIconSV,
  inactiveIconSV,
  inactiveBubbleColor,
}: {
  itemIndex: number;
  focusPosition: SharedValue<number>;
  iconName: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
  isDark: boolean;
  centerIconSV: SharedValue<string>;
  inactiveIconSV: SharedValue<string>;
  inactiveBubbleColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = itemIndex - focusPosition.value;
    const absDistance = Math.abs(distance);

    return {
      transform: [
        { translateX: distance * TAB_SPACING },
        {
          translateY: interpolate(
            absDistance,
            [0, 1.5],
            [-12, 2],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            absDistance,
            [0, 1.5],
            [1.08, 0.92],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: interpolate(absDistance, [0, 2], [1, 0.45], Extrapolation.CLAMP),
      zIndex: interpolate(
        absDistance,
        [0, 1, 2],
        [30, 20, 10],
        Extrapolation.CLAMP,
      ),
    };
  });

  const bubbleStyle = useAnimatedStyle(() => {
    const absDistance = Math.abs(itemIndex - focusPosition.value);

    return {
      backgroundColor: interpolateColor(
        absDistance,
        [0, 0.9, 2],
        ["rgba(255,255,255,0)", inactiveBubbleColor, inactiveBubbleColor],
      ),
      transform: [
        {
          scale: interpolate(
            absDistance,
            [0, 1.5],
            [1.18, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const absDistance = Math.abs(itemIndex - focusPosition.value);

    return {
      opacity: interpolate(
        absDistance,
        [0, 1.5],
        [1, 0.78],
        Extrapolation.CLAMP,
      ),
    };
  });

  const iconAnimatedProps = useAnimatedProps(() => {
    const absDistance = Math.abs(itemIndex - focusPosition.value);

    return {
      color: interpolateColor(
        absDistance,
        [0, 1.5],
        [centerIconSV.value, inactiveIconSV.value],
      ),
    };
  });

  return (
    <Animated.View
      className="absolute left-1/2 top-1 -ml-6 h-16 w-12 items-center"
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        className="items-center justify-center"
        accessibilityRole="tab"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Animated.View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={bubbleStyle}
        >
          <Animated.View style={iconStyle}>
            <AnimatedFeather
              animatedProps={iconAnimatedProps}
              name={iconName}
              size={22}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function CustomBottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const systemColorScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();

  const bgColor = useCSSVariable("--color-background");
  const fgColor = useCSSVariable("--color-foreground");

  const fgColorSV = useSharedValue(String(fgColor));
  const bgColorSV = useSharedValue(String(bgColor));

  useEffect(() => {
    fgColorSV.value = String(fgColor);
    bgColorSV.value = String(bgColor);
  }, [fgColor, bgColor]);

  const visibleRoutes = state.routes.filter(
    (
      route,
    ): route is (typeof state.routes)[number] & { name: VisibleRouteName } =>
      route.name in tabMeta,
  );

  const activeVisibleIndex = clamp(
    visibleRoutes.findIndex(
      (route) => state.routes[state.index]?.key === route.key,
    ),
    0,
    visibleRoutes.length - 1,
  );

  const focusPosition = useSharedValue(activeVisibleIndex);
  const gestureStart = useSharedValue(activeVisibleIndex);
  const lastHapticIndex = useSharedValue(activeVisibleIndex);
  const [displayedIndex, setDisplayedIndex] = useState(activeVisibleIndex);
  const currentRoute = state.routes[state.index];
  const currentRouteIsVisibleTab = currentRoute && currentRoute.name in tabMeta;
  const resolvedTheme =
    hasAdaptiveThemes && systemColorScheme
      ? systemColorScheme
      : theme === "dark"
        ? "dark"
        : "light";
  const isDark = resolvedTheme === "dark";

  const activeRoute =
    visibleRoutes[displayedIndex] ?? visibleRoutes[activeVisibleIndex];
  const activeLabel = activeRoute ? tabMeta[activeRoute.name].label : "";
  const fadeColors: readonly [string, string, string, string] = isDark
    ? ([
        "rgba(0,0,0,0)",
        "rgba(0,0,0,0.52)",
        "rgba(0,0,0,0.88)",
        "rgba(0,0,0,0.96)",
      ] as const)
    : ([
        "rgba(255,255,255,0)",
        "rgba(255,255,255,0.56)",
        "rgba(255,255,255,0.9)",
        "rgba(255,255,255,0.96)",
      ] as const);
  const centerButtonColor = String(fgColor);
  const centerIconColor = String(bgColor);
  const inactiveIconColor = String(fgColor);
  const inactiveBubbleColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(9,9,11,0.08)";
  const centerHaloColor = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(9,9,11,0.08)";
  const labelColor = String(fgColor);

  useEffect(() => {
    focusPosition.value = withSpring(activeVisibleIndex, SPRING_CONFIG);
    lastHapticIndex.value = activeVisibleIndex;
    setDisplayedIndex(activeVisibleIndex);
  }, [activeVisibleIndex, focusPosition, lastHapticIndex]);

  if (!currentRouteIsVisibleTab) {
    return null;
  }

  function navigateToVisibleIndex(nextIndex: number) {
    const route = visibleRoutes[nextIndex];
    if (!route) return;

    const routeIndex = state.routes.findIndex((item) => item.key === route.key);
    const focused = state.index === routeIndex;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }

  function animateToIndex(nextIndex: number) {
    setDisplayedIndex(nextIndex);
    focusPosition.value = withSpring(nextIndex, SPRING_CONFIG);
    navigateToVisibleIndex(nextIndex);
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onBegin(() => {
      gestureStart.value = focusPosition.value;
      lastHapticIndex.value = Math.round(focusPosition.value);
    })
    .onUpdate((event) => {
      const nextPosition = clamp(
        gestureStart.value - event.translationX / TAB_SPACING,
        0,
        visibleRoutes.length - 1,
      );
      focusPosition.value = nextPosition;

      const roundedIndex = Math.round(nextPosition);
      if (roundedIndex !== lastHapticIndex.value) {
        lastHapticIndex.value = roundedIndex;
        scheduleOnRN(triggerSelectionHaptic);
        scheduleOnRN(setDisplayedIndex, roundedIndex);
      }
    })
    .onEnd(() => {
      const nextIndex = clamp(
        Math.round(focusPosition.value),
        0,
        visibleRoutes.length - 1,
      );
      lastHapticIndex.value = nextIndex;
      scheduleOnRN(animateToIndex, nextIndex);
    });

  const bottomInset = Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 12;

  return (
    <View
      className="absolute inset-x-0 bottom-0 w-full bg-transparent"
      pointerEvents="box-none"
    >
      <LinearGradient
        pointerEvents="none"
        colors={fadeColors}
        locations={[0, 0.22, 0.58, 1]}
        className="absolute inset-x-0 bottom-0 h-56"
      />
      <GestureDetector gesture={panGesture}>
        <View
          className="relative w-full items-center bg-transparent"
          style={{ paddingBottom: bottomInset }}
        >
          <View
            className="absolute inset-x-0 top-0 items-center"
            pointerEvents="none"
          >
            <View
              className="h-19 w-19 -top-5.5 rounded-full"
              style={{ backgroundColor: centerHaloColor }}
            />
            <View
              className="absolute -top-3 h-14 w-14 rounded-full"
              style={{ backgroundColor: centerButtonColor }}
            />
          </View>

          <View className="h-16 w-full">
            {visibleRoutes.map((route, index) => {
              const meta = tabMeta[route.name];

              return (
                <DraggableTabItem
                  key={route.key}
                  itemIndex={index}
                  focusPosition={focusPosition}
                  iconName={meta.iconName}
                  isDark={isDark}
                  centerIconSV={bgColorSV}
                  inactiveIconSV={fgColorSV}
                  inactiveBubbleColor={inactiveBubbleColor}
                  onPress={() => {
                    triggerSelectionHaptic();
                    animateToIndex(index);
                  }}
                />
              );
            })}
          </View>

          {/* <View className="items-center justify-center"> */}
          {/*   <Text */}
          {/*     className="font-semibold text-xs mb-1 uppercase tracking-widest" */}
          {/*     style={{ color: labelColor }} */}
          {/*   > */}
          {/*     {activeLabel} */}
          {/*   </Text> */}
          {/* </View> */}
        </View>
      </GestureDetector>
    </View>
  );
}
