import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettleSheet } from "@/features/balances/components/settle-sheet";
import {
  personDetails,
  type PersonGroupBalance,
} from "@/features/balances/balances.data";

function inr(value: number) {
  return `₹${Math.abs(value).toLocaleString("en-IN")}`;
}

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = personDetails[id ?? ""];
  const [settleOpen, setSettleOpen] = useState(false);

  if (!person) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Person not found</Text>
      </View>
    );
  }

  const positive = person.net > 0;
  const settled = person.net === 0;

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

        <ScrollView
          contentContainerClassName="px-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-2 flex-row items-center gap-4 rounded-3xl border border-border bg-card px-5 py-5 border-continuous">
            <Image
              source={{ uri: person.avatar }}
              className="h-16 w-16 rounded-full border border-border"
            />
            <View className="flex-1">
              <Text
                className="text-2xl font-bold tracking-tight text-foreground"
                numberOfLines={1}
              >
                {person.name}
              </Text>
              <Text className="mt-0.5 text-xs text-muted">{person.phone}</Text>
              {person.upiId && (
                <View className="mt-2 flex-row items-center gap-1.5 self-start rounded-full bg-background px-2.5 py-1">
                  <Feather name="at-sign" size={11} color="#818CF8" />
                  <Text className="text-xs font-medium text-muted">
                    {person.upiId}
                  </Text>
                </View>
              )}
            </View>
            <View className="items-end">
              <Text
                className={[
                  "text-2xl font-bold tracking-tight",
                  settled ? "text-muted" : positive ? "text-success" : "text-danger",
                ].join(" ")}
              >
                {settled ? "₹0" : `${positive ? "+" : "−"}${inr(person.net)}`}
              </Text>
              <Text className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {settled ? "Settled" : positive ? "owes you" : "you owe"}
              </Text>
            </View>
          </View>

          {!settled && (
            <Pressable
              onPress={() => setSettleOpen(true)}
              className="mt-4 h-12 w-full items-center justify-center rounded-full bg-foreground active:opacity-90"
            >
              <Text className="text-base font-bold text-background">
                Settle Up
              </Text>
            </Pressable>
          )}

          <Text className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Across Groups
          </Text>
          <View className="gap-3">
            {person.breakdown.map((line) => (
              <BreakdownRow key={line.groupId} line={line} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <SettleSheet
        isOpen={settleOpen}
        onOpenChange={setSettleOpen}
        targets={[
          {
            id: person.id,
            name: person.name,
            avatar: person.avatar,
            amount: Math.abs(person.net),
            upiId: person.upiId,
          },
        ]}
      />
    </View>
  );
}

function BreakdownRow({ line }: { line: PersonGroupBalance }) {
  const positive = line.amount > 0;
  return (
    <Pressable
      onPress={() => router.push(`/group/${line.groupId}`)}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-card-deep">
        <Text style={{ fontSize: 20 }}>{line.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {line.groupName}
        </Text>
        <Text className="mt-0.5 text-xs text-muted">
          {positive ? "owes you here" : "you owe here"}
        </Text>
      </View>
      <Text
        className={[
          "text-base font-bold",
          positive ? "text-success" : "text-danger",
        ].join(" ")}
      >
        {`${positive ? "+" : "−"}${inr(line.amount)}`}
      </Text>
    </Pressable>
  );
}
