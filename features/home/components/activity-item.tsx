import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { RecentActivityItem } from "../home.data";

export function ActivityItem({
  item,
  index = 0,
}: {
  item: RecentActivityItem;
  index?: number;
}) {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      bgOpacity.value,
      [0, 1],
      ["rgba(255,255,255,0)", "rgba(255,255,255,0.04)"],
    ),
    borderRadius: 14,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 55).springify().damping(18)}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15 });
          bgOpacity.value = withSpring(1, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
          bgOpacity.value = withSpring(0, { damping: 12 });
        }}
      >
        <Animated.View style={pressStyle} className="flex-row items-center px-2 py-2">
          <View className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card">
            <Image source={{ uri: item.avatar }} className="h-full w-full" />
          </View>

          <View className="flex-1 px-4">
            <Text className="text-xl font-semibold tracking-tight text-foreground">
              {item.user}
            </Text>
            <Text className="mt-0.5 text-base text-zinc-300">{item.action}</Text>
          </View>

          <View className="items-end gap-1">
            <Text
              className={[
                "text-3xl font-bold tracking-tight",
                item.type === "receive" ? "text-emerald-400" : "text-red-400",
              ].join(" ")}
            >
              {item.amount}
            </Text>
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {item.time}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
