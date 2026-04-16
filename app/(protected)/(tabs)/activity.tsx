import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { TabProfileButton } from "@/components/tab-profile-button";

export default function ActivityScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "transparent" }}>
        <View className="flex-1 px-5 pt-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-4xl font-bold tracking-tight text-foreground">
                Activity
              </Text>
            </View>

            <TabProfileButton />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
