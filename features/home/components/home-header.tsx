import { Text, View } from "react-native";
import { TabProfileButton } from "@/components/tab-profile-button";

// scrollY / snapPoint kept in props so callers don't need to change
type Props = {
  scrollY?: unknown;
  snapPoint?: unknown;
};

export function HomeHeader(_props: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
      <Text className="text-4xl font-bold tracking-tight text-foreground">
        Equaly
      </Text>
      <TabProfileButton />
    </View>
  );
}
