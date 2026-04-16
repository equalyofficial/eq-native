import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function CardBackdrop() {
  return (
    <View className="absolute inset-0 overflow-hidden rounded-4xl">
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.12)",
          "rgba(255,255,255,0.02)",
          "rgba(0,0,0,0)",
        ]}
        start={{ x: 0.05, y: 0.1 }}
        end={{ x: 0.95, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradient
        colors={[
          "rgba(140,132,255,0.34)",
          "rgba(140,132,255,0.08)",
          "rgba(140,132,255,0)",
        ]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.6 }}
        style={styles.topGlow}
      />

      <LinearGradient
        colors={[
          "rgba(109,114,255,0)",
          "rgba(109,114,255,0.12)",
          "rgba(208,202,255,0.1)",
        ]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomGlow}
      />

      <View className="absolute inset-0 opacity-20">
        <View className="absolute -left-6 top-5 h-24 w-24 rounded-3xl border border-white/20" />
        <View className="absolute left-20 top-3 h-16 w-20 rounded-2xl border border-white/15" />
        <View className="absolute right-6 top-4 h-20 w-16 rounded-2xl border border-white/15" />
        <View className="absolute left-6 top-28 h-24 w-28 rounded-3xl border border-white/10" />
        <View className="absolute left-36 top-24 h-16 w-24 rounded-2xl border border-white/10" />
        <View className="absolute right-12 top-24 h-24 w-24 rounded-3xl border border-white/10" />
        <View className="absolute left-14 top-16 h-1 w-1 rounded-full bg-white/20" />
        <View className="absolute left-40 top-14 h-1 w-1 rounded-full bg-white/15" />
        <View className="absolute right-20 top-20 h-1 w-1 rounded-full bg-white/15" />
        <View className="absolute left-24 bottom-10 h-1 w-1 rounded-full bg-white/10" />
      </View>
    </View>
  );
}

function MovingGlow() {
  const progress = useSharedValue(-1);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 3200,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 520 }, { rotate: "-18deg" }],
  }));

  return (
    <Animated.View style={[styles.movingGlow, animatedStyle]}>
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

export function NetBalanceCard() {
  const brandAccent = useCSSVariable('--color-brand-accent');
  const successColor = useCSSVariable('--color-success');
  const dangerColor = useCSSVariable('--color-danger');
  const cardDeep = useCSSVariable('--color-card-deep');
  const brandGold = useCSSVariable('--color-brand-gold');

  return (
    <View className="px-5">
      <View style={styles.outerGlow} className="rounded-[2.15rem]">
        <View className="overflow-hidden rounded-[2rem] border border-white/10 bg-card-deep">
          <LinearGradient
            colors={["#1A103A", "#2E1E68", "#4A35A0", "#21124D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <LinearGradient
            colors={["rgba(156,145,255,0.22)", "rgba(156,145,255,0.02)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.innerBorderGlow}
          />

          <CardBackdrop />
          <MovingGlow />

          <View className="gap-5 px-5 py-6">
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Net Balance
              </Text>
              <Text className="text-5xl font-bold tracking-tight text-white">
                +₹2,400
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-row items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/55 px-3 py-2">
                <Feather name="arrow-up" size={12} color={String(successColor)} />
                <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                  Owed ₹4,800
                </Text>
              </View>

              <View className="flex-row items-center gap-2 rounded-full border border-red-500/30 bg-red-950/45 px-3 py-2">
                <Feather name="arrow-down" size={12} color={String(dangerColor)} />
                <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-red-400">
                  Owe ₹2,400
                </Text>
              </View>
            </View>

            <View className="h-px bg-white/10" />

            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-indigo-50">
                Snehasish Mandal
              </Text>
              <Pressable className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
                  Settle Up
                </Text>
                <Feather name="arrow-right" size={16} color={String(useCSSVariable('--color-background'))} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

  // Helper to get brand accent for styles outside the component
  const getBrandAccent = () => useCSSVariable('--color-brand-accent');

  const styles = StyleSheet.create({
    outerGlow: {
      shadowColor: "#6F63FF", // We will fix this in a different way since StyleSheet.create is static
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.22,
      shadowRadius: 22,
      elevation: 12,
    },

  innerBorderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(156,145,255,0.18)",
  },
  topGlow: {
    position: "absolute",
    left: -44,
    top: -46,
    height: 180,
    width: 236,
    borderRadius: 999,
  },
  bottomGlow: {
    position: "absolute",
    right: -52,
    bottom: -60,
    height: 190,
    width: 232,
    borderRadius: 999,
  },
  movingGlow: {
    position: "absolute",
    left: -300,
    top: -56,
    height: 400,
    width: 220,
    opacity: 0.56,
  },
});
