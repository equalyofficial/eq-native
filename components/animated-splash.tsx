import { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

const logoLight = require("../assets/images/equaly-logo-light.png");
const logoDark = require("../assets/images/equaly-logo-dark.png");

export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const isDark = useEffectiveColorScheme() === "dark";

  const container = useSharedValue(1);
  const logoScale = useSharedValue(0.9);
  const nameOpacity = useSharedValue(0);
  const nameShift = useSharedValue(10);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 620,
      easing: Easing.out(Easing.back(1.5)),
    });
    nameOpacity.value = withDelay(300, withTiming(1, { duration: 420 }));
    nameShift.value = withDelay(
      300,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
    container.value = withDelay(
      2800,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  }, [container, logoScale, nameOpacity, nameShift]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: container.value }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameShift.value }],
  }));

  return (
    <Animated.View
      className="absolute inset-0 items-center justify-center bg-background"
      style={containerStyle}
    >
      <Animated.View style={logoStyle} className="items-center">
        <View className="overflow-hidden rounded-[36px] border-continuous">
          <Image
            source={isDark ? logoLight : logoDark}
            style={{ height: 148, width: 148 }}
            resizeMode="cover"
          />
        </View>
        <Animated.Text
          style={nameStyle}
          className="mt-6 text-4xl font-bold tracking-tight text-foreground"
        >
          Equaly
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}
