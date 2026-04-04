import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

function CardBackdrop() {
  return (
    <View className="absolute inset-0 overflow-hidden rounded-[2rem] opacity-20">
      <View className="absolute -left-8 top-4 h-24 w-24 rounded-2xl border border-white/20" />
      <View className="absolute left-20 top-2 h-16 w-20 rounded-2xl border border-white/15" />
      <View className="absolute right-6 top-4 h-20 w-16 rounded-2xl border border-white/15" />
      <View className="absolute left-6 top-28 h-24 w-28 rounded-2xl border border-white/15" />
      <View className="absolute left-36 top-24 h-16 w-24 rounded-2xl border border-white/10" />
      <View className="absolute right-12 top-24 h-24 w-24 rounded-2xl border border-white/15" />
    </View>
  );
}

export function NetBalanceCard() {
  return (
    <View className="px-5">
      <View className="overflow-hidden rounded-[2rem] border border-[#2D2165] bg-linear-to-br from-[#26185A] to-[#170F3C]">
        <CardBackdrop />

        <View className="gap-5 px-5 py-6">
          <View className="gap-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8D84FF]">
              Net Balance
            </Text>
            <Text className="text-5xl font-bold tracking-tight text-white">
              +₹2,400
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-950/70 px-3 py-2">
              <Feather name="arrow-up" size={12} color="#4ADE80" />
              <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                Owed ₹4,800
              </Text>
            </View>

            <View className="flex-row items-center gap-2 rounded-full border border-red-900/60 bg-red-950/70 px-3 py-2">
              <Feather name="arrow-down" size={12} color="#F87171" />
              <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-red-400">
                Owe ₹2,400
              </Text>
            </View>
          </View>

          <View className="h-px bg-[#3A2B74]" />

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-indigo-100">
              Snehasish Mandal
            </Text>
            <Pressable className="flex-row items-center gap-2">
              {/* <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-white"> */}
              {/*   Settle Up */}
              {/* </Text> */}
              <Feather name="arrow-right" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
