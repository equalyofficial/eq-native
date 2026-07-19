import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const CARD_GRADIENT = ["#1A103A", "#2E1E68", "#4A35A0", "#21124D"] as const;

function MovingGlow() {
  const progress = useSharedValue(-1);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 420 }, { rotate: "-18deg" }],
  }));

  return (
    <Animated.View style={[styles.movingGlow, animStyle]}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0.03)",
          "rgba(255,255,255,0.16)",
          "rgba(201,193,255,0.05)",
          "rgba(189,176,255,0)",
        ]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
}

export function BalancesTotalCard({ amount }: { amount: string }) {
  const symbol = amount.slice(0, 1);
  const value = amount.slice(1);

  return (
    <View className="mt-2 overflow-hidden rounded-3xl border-continuous" style={styles.glow}>
      <LinearGradient
        colors={CARD_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={["rgba(140,132,255,0.34)", "rgba(140,132,255,0.08)", "rgba(140,132,255,0)"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={styles.topGlow}
      />
      <MovingGlow />

      <View className="flex-row items-center justify-between px-5 py-5">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Total Net Balance
          </Text>
          <Text className="mt-1 text-5xl font-bold tracking-tight text-white">
            <Text className="text-brand-indigo">{symbol}</Text>
            {value}
          </Text>
        </View>

        <Feather name="credit-card" size={44} color="rgba(255,255,255,0.16)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: "#6F63FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 12,
  },
  topGlow: {
    position: "absolute",
    left: -44,
    top: -46,
    height: 160,
    width: 220,
    borderRadius: 999,
  },
  movingGlow: {
    position: "absolute",
    left: -240,
    top: -56,
    height: 320,
    width: 200,
    opacity: 0.56,
  },
});
