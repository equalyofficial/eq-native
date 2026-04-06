import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

import { BalancePeopleRow } from "../components/balance-people-row";
import { HomeHeader } from "../components/home-header";
import { HomeEmptyState } from "../components/home-empty-state";
import { MainSettleButton } from "../components/main-settle-button";
import { NetBalanceCard } from "../components/net-balance-card";
import { RecentActivitySection } from "../components/recent-activity-section";
import { homeState, homeSummary, recentActivity } from "../home.data";

export default function HomeScreen() {
  if (!homeState.hasGroups) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View className="flex-1 bg-background">
          <HomeHeader />
          <HomeEmptyState
            title="Add your first group to start splitting"
            description="No pending balances yet. Create a group and start tracking shared expenses."
            actionLabel="Create Group"
            onPress={() => router.push("/groups")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <HomeHeader />
        <NetBalanceCard />
        {/* <View className="px-5 pt-6"> */}
        {/*   <MainSettleButton */}
        {/*     show={homeState.hasBalances && homeSummary.oweAmount !== "₹0"} */}
        {/*   /> */}
        {/* </View> */}
        {homeState.hasBalances ? <BalancePeopleRow /> : null}
        {homeState.hasActivity ? (
          <RecentActivitySection items={recentActivity.slice(0, 5)} />
        ) : (
          <HomeEmptyState
            title="No recent activity"
            description="Once your groups start adding expenses, the latest updates will appear here."
          />
        )}
      </View>
    </SafeAreaView>
  );
}
