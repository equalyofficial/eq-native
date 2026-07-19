import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { TabProfileButton } from "@/components/tab-profile-button";

import { BalancesTotalCard } from "../components/balances-total-card";
import { SegmentToggle } from "../components/segment-toggle";

type BalanceSegment = "people" | "groups";
import { BalancesSearchBar } from "../components/balances-search-bar";
import { PersonBalanceRow } from "../components/person-balance-row";
import { GroupBalanceRow } from "../components/group-balance-row";
import {
  groupBalances,
  peopleBalances,
  totalNetBalance,
} from "../balances.data";

export default function BalancesScreen() {
  const [segment, setSegment] = useState<BalanceSegment>("people");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredPeople = useMemo(
    () =>
      peopleBalances.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.phone.replace(/\s/g, "").includes(q),
      ),
    [q],
  );

  const filteredGroups = useMemo(
    () => groupBalances.filter((g) => g.name.toLowerCase().includes(q)),
    [q],
  );

  const bg = useCSSVariable("--color-background") as string;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-4xl font-bold tracking-tight text-foreground">
            Balances
          </Text>
          <TabProfileButton />
        </View>

        <View className="px-5">
          <BalancesTotalCard amount={totalNetBalance} />
          <View className="mt-4">
            <SegmentToggle
              options={[
                { value: "people", label: "People" },
                { value: "groups", label: "Groups" },
              ]}
              value={segment}
              onChange={setSegment}
            />
          </View>
          <BalancesSearchBar value={query} onChangeText={setQuery} />
        </View>

        <View className="flex-1">
          {segment === "people" ? (
            <FlatList
              data={filteredPeople}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PersonBalanceRow person={item} />}
              contentContainerClassName="px-5 pt-5 pb-40 gap-3"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptyState label="No people found" />}
            />
          ) : (
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <GroupBalanceRow group={item} />}
              contentContainerClassName="px-5 pt-5 pb-40 gap-3"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptyState label="No groups found" />}
            />
          )}

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
    height: 20,
  },
});

function EmptyState({ label }: { label: string }) {
  return (
    <View className="items-center pt-16">
      <Text className="text-sm text-muted">{label}</Text>
    </View>
  );
}
