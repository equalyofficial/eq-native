import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CustomBottomTabBar } from "@/components/custom-bottom-tab-bar";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{ swipeEnabled: true, lazy: false }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />
      <MaterialTopTabs.Screen name="groups" options={{ title: "Balances" }} />
      <MaterialTopTabs.Screen name="slice" options={{ title: "Slice" }} />
      <MaterialTopTabs.Screen name="activity" options={{ title: "Activity" }} />
      <MaterialTopTabs.Screen name="insights" options={{ title: "Insights" }} />
    </MaterialTopTabs>
  );
}
