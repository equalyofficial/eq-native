import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

export const CARD_FULL_HEIGHT = 240;
export const PEEK_HEIGHT = 72;

// ─── Decorative backdrop (front face only) ───────────────────────────────────

function CardBackdrop() {
  return (
    <View className="absolute inset-0 overflow-hidden rounded-[2rem]">
      <LinearGradient
        colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.02)", "rgba(0,0,0,0)"]}
        start={{ x: 0.05, y: 0.1 }}
        end={{ x: 0.95, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={["rgba(140,132,255,0.34)", "rgba(140,132,255,0.08)", "rgba(140,132,255,0)"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.6 }}
        style={styles.topGlow}
      />
      <LinearGradient
        colors={["rgba(109,114,255,0)", "rgba(109,114,255,0.12)", "rgba(208,202,255,0.1)"]}
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
      </View>
    </View>
  );
}

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
    transform: [{ translateX: progress.value * 520 }, { rotate: "-18deg" }],
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

// ─── Front face ──────────────────────────────────────────────────────────────

function CardFrontFace() {
  return (
    <View style={{ height: CARD_FULL_HEIGHT }} className="overflow-hidden rounded-[2rem]">
      <LinearGradient
        colors={["#1A103A", "#2E1E68", "#4A35A0", "#21124D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
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
            <Feather name="arrow-up" size={12} color="#4ADE80" />
            <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Owed ₹4,800
            </Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full border border-red-500/30 bg-red-950/45 px-3 py-2">
            <Feather name="arrow-down" size={12} color="#EF4444" />
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
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
              Settle Up
            </Text>
            <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.9)" />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Back face ───────────────────────────────────────────────────────────────
// Height is CARD_FULL_HEIGHT so the rounded bottom corners sit BELOW the
// PEEK_HEIGHT clip — gives a clean flat cut with no pill shape.
//
// Background gradient fades to transparent at the bottom of the 72px visible
// zone so scrolled content shows through, making the gradient effect visible.

function CardBackFace({ shimmerX }: { shimmerX: SharedValue<number> }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
    opacity: 0.35,
  }));

  return (
    <View style={{ height: CARD_FULL_HEIGHT }} className="overflow-hidden rounded-[2rem]">
      <LinearGradient
        colors={["#1A103A", "#2E1E68", "#4A35A0", "#21124D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Shimmer sweep on flip reveal */}
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.28)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Content pinned to the top PEEK_HEIGHT — only this is ever visible */}
      <View style={{ height: PEEK_HEIGHT }} className="flex-row items-center justify-between px-5">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Text className="text-sm font-bold text-white">SM</Text>
          </View>
          <View>
            <Text className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Balance
            </Text>
            <Text className="text-[15px] font-semibold text-white">
              Snehasish Mandal
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="text-lg font-bold text-emerald-400">+₹2,400</Text>
          <Animated.View style={pulseStyle} className="rounded-full bg-white/15 px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Settle
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

type Props = {
  scrollY: SharedValue<number>;
  snapPoint: number;
};

export function NetBalanceCard({ scrollY, snapPoint }: Props) {
  const shimmerX = useSharedValue(-200);

  // 0 = fully expanded, 1 = fully collapsed.
  // Springs to completion on threshold cross so the flip always finishes
  // cleanly regardless of how fast the user scrolled.
  const cardProgress = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      if (y > snapPoint * 0.6 && cardProgress.value < 0.5) {
        cardProgress.value = withSpring(1, { damping: 32, stiffness: 260, mass: 0.9 });
      } else if (y < snapPoint * 0.4 && cardProgress.value > 0.5) {
        cardProgress.value = withSpring(0, { damping: 32, stiffness: 260, mass: 0.9 });
      }
    },
  );

  // Shimmer fires when card finishes collapsing (cardProgress near 1)
  useAnimatedReaction(
    () => cardProgress.value > 0.95,
    (isFlipped, wasFlipped) => {
      if (isFlipped && !wasFlipped) {
        shimmerX.value = -200;
        shimmerX.value = withTiming(420, { duration: 680, easing: Easing.out(Easing.quad) });
      }
    },
  );

  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(cardProgress.value, [0, 1], [CARD_FULL_HEIGHT, PEEK_HEIGHT], Extrapolation.CLAMP),
  }));

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(cardProgress.value, [0, 1], [0, 180]);
    const opacity = interpolate(
      cardProgress.value,
      [0.35, 0.65],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(cardProgress.value, [0, 1], [-180, 0]);
    const opacity = interpolate(
      cardProgress.value,
      [0.35, 0.65],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
    };
  });

  return (
    // bg-background fills the full-width container (including the mx-5 margins
    // of the card face) so scroll content cannot bleed through the sides.
    <Animated.View
      style={[
        containerStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: "hidden",
        },
      ]}
      className="bg-background"
    >
      <View style={styles.outerGlow} className="mx-5 flex-1">
        <Animated.View style={frontStyle}>
          <CardFrontFace />
        </Animated.View>
        <Animated.View style={backStyle}>
          <CardBackFace shimmerX={shimmerX} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerGlow: {
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
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 120,
    zIndex: 1,
  },
});
