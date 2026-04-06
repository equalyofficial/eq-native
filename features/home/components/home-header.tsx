import { Text, View } from "react-native";
import { TabProfileButton } from "@/components/tab-profile-button";

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 pb-6 pt-3">
      <View className="flex-row items-center gap-4">
        <Text className="text-4xl font-bold tracking-tight text-foreground">
          Equaly
        </Text>
      </View>

      <TabProfileButton />
    </View>
  );
}
