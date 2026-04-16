import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { CustomBottomTabBar } from "@/components/custom-bottom-tab-bar";

export default function TabLayout() {
  const isDark = useEffectiveColorScheme() === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";

  return (
    <Tabs
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="groups" options={{ title: "Groups" }} />
      <Tabs.Screen name="slice" options={{ title: "Slice" }} />
      <Tabs.Screen name="friends" options={{ title: "Friends" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
    </Tabs>
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
