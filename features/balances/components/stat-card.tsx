import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { Sparkline } from "./sparkline";

type StatType = "owed" | "debt";

const CONFIG: Record<
  StatType,
  { color: string; tint: readonly [string, string]; sign: string }
> = {
  owed: {
    color: "#4ADE80",
    tint: ["rgba(74,222,128,0.12)", "rgba(74,222,128,0)"],
    sign: "+",
  },
  debt: {
    color: "#F87171",
    tint: ["rgba(248,113,113,0.12)", "rgba(248,113,113,0)"],
    sign: "−",
  },
};

export function StatCard({
  label,
  amount,
  type,
  data,
}: {
  label: string;
  amount: string;
  type: StatType;
  data: number[];
}) {
  const cfg = CONFIG[type];
  const isDark = useEffectiveColorScheme() === "dark";

  return (
    <View className="flex-1 overflow-hidden rounded-2xl border border-border bg-card border-continuous">
      <LinearGradient
        colors={cfg.tint}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        pointerEvents="none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, opacity: 0.5 }}
      >
        <Sparkline data={data} color={cfg.color} height={40} width="100%" />
      </View>

      <View className="px-4 pt-3 pb-6">
        <Text className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {label}
        </Text>
        <View className="mt-1.5 self-start overflow-hidden rounded-xl">
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <Text
            className="px-2.5 py-1 text-xl font-bold tracking-tight"
            style={{ color: cfg.color }}
          >
            {cfg.sign}
            {amount}
          </Text>
        </View>
      </View>
    </View>
  );
}
