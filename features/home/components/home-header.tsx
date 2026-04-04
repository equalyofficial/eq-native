import { Image, Pressable, Text, View } from "react-native";

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 pb-6 pt-3">
      <View className="flex-row items-center gap-4">
        <Text className="text-4xl font-bold tracking-tight text-foreground">
          Equaly
        </Text>
      </View>

      <Pressable className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card">
        <Image
          source={{ uri: "https://i.pravatar.cc/160?img=19" }}
          className="h-full w-full"
        />
      </Pressable>
    </View>
  );
}
