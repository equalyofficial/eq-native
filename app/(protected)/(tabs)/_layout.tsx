import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CustomBottomTabBar } from "@/components/custom-bottom-tab-bar";
import { SliceCTAButton } from "@/features/slice/components/slice-cta-button";
import { useSliceCTAStore } from "@/features/slice/hooks/use-slice-cta-store";

// Snappy spring with a barely-perceptible overshoot — feels physical, not bouncy
const SPRING_IN = { damping: 18, stiffness: 380, mass: 0.55 };
const EASE_OUT = { duration: 160, easing: Easing.out(Easing.cubic) };

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Selector — only re-renders when isActive flips, not on every digit typed
  const isActive = useSliceCTAStore((s) => s.isActive);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.82);
  const translateY = useSharedValue(18);

  useEffect(() => {
    // Subscribe directly to Zustand — fires before any React re-render,
    // so the animation starts the same JS frame the digit is typed.
    return useSliceCTAStore.subscribe((state) => {
      if (state.isActive) {
        opacity.value = withTiming(1, { duration: 90 });
        scale.value = withSpring(1, SPRING_IN);
        translateY.value = withSpring(0, SPRING_IN);
      } else {
        opacity.value = withTiming(0, EASE_OUT);
        scale.value = withTiming(0.82, EASE_OUT);
        translateY.value = withTiming(18, EASE_OUT);
      }
    });
  }, [opacity, scale, translateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomBottomTabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="groups" options={{ title: "Groups" }} />
        <Tabs.Screen name="slice" options={{ title: "Slice" }} />
        <Tabs.Screen name="friends" options={{ title: "Friends" }} />
        <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      </Tabs>

      {/* Rendered after <Tabs> — naturally above the tab bar and its gradient */}
      <Animated.View
        style={[
          styles.ctaOverlay,
          { bottom: insets.bottom + 112, paddingHorizontal: 20 },
          overlayStyle,
        ]}
        pointerEvents={isActive ? "auto" : "none"}
      >
        <SliceCTAButton
          isEnabled
          onPress={() => useSliceCTAStore.getState().onPress?.()}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    position: "absolute",
    backgroundColor: "transparent",
  },
  ctaOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
