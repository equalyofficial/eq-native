import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { CustomBottomTabBar } from "@/components/custom-bottom-tab-bar";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomBottomTabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="groups" options={{ title: "Balances" }} />
        <Tabs.Screen name="slice" options={{ title: "Slice" }} />
        <Tabs.Screen name="activity" options={{ title: "Activity" }} />
        <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    position: "absolute",
    backgroundColor: "transparent",
  },
});
