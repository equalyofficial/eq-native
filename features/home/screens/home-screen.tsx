import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { ActiveGroupsRow } from "../components/active-groups-row";
import { BalancePeopleRow } from "../components/balance-people-row";
import { HomeEmptyState } from "../components/home-empty-state";
import { HomeHeader } from "../components/home-header";
import { InsightsRow } from "../components/insights-row";
import {
  NetBalanceCard,
  CARD_FULL_HEIGHT,
  PEEK_HEIGHT,
} from "../components/net-balance-card";
import { RecentActivitySection } from "../components/recent-activity-section";
import { SpendingBreakdown } from "../components/spending-breakdown";
import { homeState, recentActivity } from "../home.data";

const SNAP_POINT = CARD_FULL_HEIGHT - PEEK_HEIGHT;
const GRADIENT_HEIGHT = 200;

export default function HomeScreen() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // River gradient anchored to the card's animated bottom edge, pointing down.
  // Opacity is 0 when the card is fully expanded so the gradient is invisible
  // at rest and only materialises as the card begins to collapse — content then
  // appears to flow upward and dissolve into the card like a narrowing river.
  const absorptionStyle = useAnimatedStyle(() => {
    const cardBottom = interpolate(
      scrollY.value,
      [0, SNAP_POINT],
      [CARD_FULL_HEIGHT, PEEK_HEIGHT],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, SNAP_POINT * 0.5, SNAP_POINT],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
    return { top: cardBottom, opacity };
  });

  if (!homeState.hasGroups) {
    return (
      <View className="flex-1 bg-background">
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 1, backgroundColor: "transparent" }}
        >
          <HomeHeader scrollY={scrollY} snapPoint={SNAP_POINT} />
          <HomeEmptyState
            title="Add your first group to start splitting"
            description="No pending balances yet. Create a group and start tracking shared expenses."
            actionLabel="Create Group"
            onPress={() => router.push("/groups")}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <HomeHeader scrollY={scrollY} snapPoint={SNAP_POINT} />

        <View style={{ flex: 1 }}>
          {/* Scrollable content — rendered first, lowest in Android z-order */}
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: CARD_FULL_HEIGHT,
              paddingBottom: 160,
            }}
          >
            <InsightsRow />
            <BalancePeopleRow />
            <SpendingBreakdown />
            <ActiveGroupsRow />
            <RecentActivitySection items={recentActivity.slice(0, 5)} />
          </Animated.ScrollView>

          {/* River gradient — TEMPORARILY DISABLED for rework.
          <Animated.View
            style={[absorptionStyle, styles.absorptionGradient]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["#1A103A", "rgba(26,16,58,0.8)", "rgba(26,16,58,0)"]}
              locations={[0, 0.15, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
          */}

          {/* Card — rendered last, topmost layer */}
          <NetBalanceCard scrollY={scrollY} snapPoint={SNAP_POINT} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  absorptionGradient: {
    position: "absolute",
    left: 20,
    right: 20,
    height: GRADIENT_HEIGHT,
    zIndex: 9,
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
});
