import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { activeGroups, type ActiveGroup } from "../home.data";

function GroupCard({ group }: { group: ActiveGroup }) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const balanceColor =
    group.balanceType === "receive"
      ? "text-emerald-400"
      : group.balanceType === "owe"
        ? "text-red-400"
        : "text-muted";

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 14, stiffness: 200 });
        rotate.value = withSpring(-1, { damping: 14, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 160 });
        rotate.value = withSpring(0, { damping: 12, stiffness: 160 });
      }}
    >
      <Animated.View
        style={animStyle}
        className="mr-4 w-44 rounded-3xl border border-border bg-card p-4"
      >
        <Text style={{ fontSize: 26 }}>{group.emoji}</Text>
        <Text
          className="mt-2 text-base font-bold tracking-tight text-foreground"
          numberOfLines={1}
        >
          {group.name}
        </Text>
        <Text className="mt-0.5 text-xs font-medium text-muted">
          {group.memberCount} members
        </Text>

        <View className="mt-3 h-px bg-border" />

        <Text className="mt-3 text-xs text-muted" numberOfLines={1}>
          {group.lastExpense}
        </Text>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {group.lastExpenseTime}
          </Text>
          <Text className={`text-sm font-bold ${balanceColor}`}>
            {group.totalBalance}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function ActiveGroupsRow() {
  return (
    <View className="pt-8">
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          Groups
        </Text>
        <Pressable onPress={() => router.push("/groups")}>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            See All
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {activeGroups.map((g) => (
          <GroupCard key={g.id} group={g} />
        ))}
      </ScrollView>
    </View>
  );
}
