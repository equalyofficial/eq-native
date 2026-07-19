import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { TabProfileButton } from "@/components/tab-profile-button";

import { ActivityHeroCard } from "../components/activity-hero-card";
import { ActivityTimeline } from "../components/activity-timeline";
import { activityNetMovement, activitySections } from "../activity.data";

export default function ActivityScreen() {
  const bg = useCSSVariable("--color-background") as string;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
          <Text className="text-4xl font-bold tracking-tight text-foreground">
            Activity
          </Text>
          <TabProfileButton />
        </View>

        <View className="px-5 pt-2">
          <ActivityHeroCard amount={activityNetMovement} />
        </View>

        <View className="mt-4 flex-1">
          <ActivityTimeline sections={activitySections} />

          {bg && (
            <LinearGradient
              pointerEvents="none"
              colors={[bg, `${bg}00`]}
              style={styles.topFade}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 24,
  },
});
