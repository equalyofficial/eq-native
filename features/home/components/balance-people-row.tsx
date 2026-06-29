import { router } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { balanceContacts } from "../home.data";

function PersonBalanceCard({
  name,
  amount,
  type,
  avatar,
}: {
  name: string;
  amount: string;
  type: "receive" | "owe";
  avatar: string;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      className="mr-4 w-20 items-center"
      onPressIn={() => {
        scale.value = withSpring(0.93, { damping: 14, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 160 });
      }}
    >
      <Animated.View style={animStyle} className="items-center">
        <View className="relative h-16 w-16">
          <View className="h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-card">
            <Image source={{ uri: avatar }} className="h-full w-full" />
          </View>
          <View
            className={[
              "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
              type === "receive" ? "bg-emerald-400" : "bg-red-400",
            ].join(" ")}
          />
        </View>
        <Text className="mt-3 text-sm font-semibold text-foreground">{name}</Text>
        <Text
          className={[
            "mt-1 text-xs font-semibold",
            type === "receive" ? "text-emerald-400" : "text-red-400",
          ].join(" ")}
        >
          {amount}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function BalancePeopleRow() {
  return (
    <View className="px-5 pt-8">
      <View className="mb-5 flex-row items-end justify-between">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          People
        </Text>
        <Pressable onPress={() => router.push("/friends")}>
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            See All
          </Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={balanceContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PersonBalanceCard {...item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
