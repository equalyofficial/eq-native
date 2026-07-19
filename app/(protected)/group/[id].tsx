import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SegmentToggle } from "@/features/balances/components/segment-toggle";
import { SettleSheet } from "@/features/balances/components/settle-sheet";
import { StatCard } from "@/features/balances/components/stat-card";
import {
  groupDetails,
  type GroupActivityItem,
  type GroupMemberBalance,
} from "@/features/balances/balances.data";

type GroupTab = "members" | "activity";

const OWED_TREND = [3, 4, 3.6, 5, 4.4, 6, 6.8];
const DEBT_TREND = [6, 5.4, 5.8, 4.2, 4.6, 3.4, 2.8];

function inr(value: number) {
  return `₹${Math.abs(value).toLocaleString("en-IN")}`;
}

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = groupDetails[id ?? ""];
  const [tab, setTab] = useState<GroupTab>("members");
  const [settleOpen, setSettleOpen] = useState(false);

  if (!group) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Group not found</Text>
      </View>
    );
  }

  const totalOwed = group.members
    .filter((m) => m.balance > 0)
    .reduce((sum, m) => sum + m.balance, 0);
  const totalDebt = group.members
    .filter((m) => m.balance < 0)
    .reduce((sum, m) => sum + Math.abs(m.balance), 0);
  const settled = totalOwed === 0 && totalDebt === 0;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <Feather name="chevron-left" size={22} color="#a1a1aa" />
          </Pressable>
          <Pressable
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <Feather name="more-horizontal" size={20} color="#a1a1aa" />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-4 px-5 pt-2">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-card-deep">
            <Text style={{ fontSize: 30 }}>{group.emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {group.name}
            </Text>
            <Text className="mt-1 text-xs text-muted">
              {group.memberCount} members · {group.activity[0]?.meta ?? "no activity"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 px-5 pt-5">
          <StatCard
            label="Total Owed"
            amount={inr(totalOwed)}
            type="owed"
            data={OWED_TREND}
          />
          <StatCard
            label="Total Debt"
            amount={inr(totalDebt)}
            type="debt"
            data={DEBT_TREND}
          />
        </View>

        {!settled && (
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => setSettleOpen(true)}
              className="h-12 w-full items-center justify-center rounded-full bg-foreground active:opacity-90"
            >
              <Text className="text-base font-bold text-background">
                Settle Up
              </Text>
            </Pressable>
          </View>
        )}

        <View className="px-5 pt-6">
          <SegmentToggle
            compact
            options={[
              { value: "members", label: "Members" },
              { value: "activity", label: "Activity" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {tab === "members" ? (
          <FlatList
            data={group.members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MemberRow member={item} />}
            contentContainerClassName="px-5 pt-4 pb-32 gap-3"
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={group.activity}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ActivityRow item={item} />}
            contentContainerClassName="px-5 pt-4 pb-32 gap-3"
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      <SettleSheet
        isOpen={settleOpen}
        onOpenChange={setSettleOpen}
        targets={group.members
          .filter((m) => !m.isYou && m.balance !== 0)
          .map((m) => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            amount: Math.abs(m.balance),
            upiId: m.upiId ?? `${m.name.split(" ")[0].toLowerCase()}@upi`,
          }))}
      />
    </View>
  );
}

function MemberRow({ member }: { member: GroupMemberBalance }) {
  const settled = member.balance === 0;
  const positive = member.balance > 0;

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <Image source={{ uri: member.avatar }} className="h-11 w-11 rounded-full" />
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {member.name}
          {member.isYou ? " (you)" : ""}
        </Text>
        <Text className="mt-0.5 text-xs text-muted">
          {settled
            ? "Settled up"
            : positive
              ? "owes you"
              : "you owe"}
        </Text>
      </View>
      {!member.isYou && (
        <Text
          className={[
            "text-base font-bold",
            settled ? "text-muted" : positive ? "text-success" : "text-danger",
          ].join(" ")}
        >
          {settled ? "—" : `${positive ? "+" : "−"}${inr(member.balance)}`}
        </Text>
      )}
    </View>
  );
}

function ActivityRow({ item }: { item: GroupActivityItem }) {
  const isSettlement = item.kind === "settlement";
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-background">
        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {item.title}
        </Text>
        <Text className="mt-0.5 text-xs text-muted">{item.meta}</Text>
      </View>
      <Text
        className={[
          "text-sm font-bold",
          isSettlement ? "text-success" : "text-foreground",
        ].join(" ")}
      >
        {item.amount}
      </Text>
    </View>
  );
}
