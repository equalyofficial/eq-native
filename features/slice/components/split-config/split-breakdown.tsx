import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import type { MockMember } from "../../slice-flow.data";
import type { SplitType } from "../../hooks/use-slice-flow-store";

interface SplitBreakdownProps {
  members: MockMember[];
  splitType: SplitType;
  totalAmount: number;
  equalShare: number;
  percentages: Record<string, number>;
  customAmounts: Record<string, number>;
  setPercentage: (id: string, value: number) => void;
  setCustomAmount: (id: string, value: number) => void;
}

const rupee = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  )}`;

/** Live "balanced / X left / X over" chip that anchors the whole breakdown. */
function StatusPill({
  splitType,
  members,
  totalAmount,
  percentages,
  customAmounts,
}: Pick<
  SplitBreakdownProps,
  "splitType" | "members" | "totalAmount" | "percentages" | "customAmounts"
>) {
  const successColor = String(useCSSVariable("--color-success") ?? "#16A34A");

  if (splitType === "equal") {
    return (
      <View className="rounded-full bg-background px-2.5 py-1">
        <Text className="text-[11px] font-semibold text-muted">
          {members.length} {members.length === 1 ? "person" : "people"} · equal
        </Text>
      </View>
    );
  }

  const n = members.length;
  const used =
    splitType === "percentage"
      ? members.reduce(
          (sum, m) => sum + (percentages[m.id] ?? Math.round(100 / n)),
          0,
        )
      : members.reduce(
          (sum, m) =>
            sum +
            (customAmounts[m.id] !== undefined
              ? customAmounts[m.id]!
              : totalAmount / n),
          0,
        );

  const target = splitType === "percentage" ? 100 : totalAmount;
  const remaining = Math.round(target - used);
  const fmt = (v: number) =>
    splitType === "percentage" ? `${v}%` : rupee(v);

  if (remaining === 0) {
    return (
      <View className="flex-row items-center gap-1 rounded-full bg-success/15 px-2.5 py-1">
        <Feather name="check" size={12} color={successColor} />
        <Text className="text-[11px] font-semibold text-success">Balanced</Text>
      </View>
    );
  }

  const over = remaining < 0;
  return (
    <View
      className={
        over
          ? "rounded-full bg-danger/15 px-2.5 py-1"
          : "rounded-full bg-background px-2.5 py-1"
      }
    >
      <Text
        className={
          over
            ? "text-[11px] font-semibold text-danger"
            : "text-[11px] font-semibold text-muted"
        }
      >
        {over ? `${fmt(Math.abs(remaining))} over` : `${fmt(remaining)} left`}
      </Text>
    </View>
  );
}

export function SplitBreakdown({
  members,
  splitType,
  totalAmount,
  equalShare,
  percentages,
  customAmounts,
  setPercentage,
  setCustomAmount,
}: SplitBreakdownProps) {
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000");

  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      className="rounded-3xl bg-card overflow-hidden"
    >
      {/* Header — label + live validation */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
        <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          Breakdown
        </Text>
        <StatusPill
          splitType={splitType}
          members={members}
          totalAmount={totalAmount}
          percentages={percentages}
          customAmounts={customAmounts}
        />
      </View>

      {members.map((member, index) => {
        const isLast = index === members.length - 1;
        const pct = percentages[member.id] ?? Math.round(100 / members.length);
        const custom =
          customAmounts[member.id] !== undefined
            ? customAmounts[member.id]!
            : equalShare;
        const amount =
          splitType === "percentage" ? (totalAmount * pct) / 100 : custom;
        const derivedPct =
          totalAmount > 0 ? Math.round((custom / totalAmount) * 100) : 0;

        const caption =
          splitType === "equal"
            ? "Equal share"
            : splitType === "percentage"
              ? rupee(amount)
              : `${derivedPct}% of total`;

        return (
          <View key={member.id}>
            <View className="flex-row items-center px-4 py-3.5" style={{ gap: 12 }}>
              <Image
                source={{ uri: member.avatarUrl }}
                className="h-10 w-10 rounded-full"
              />

              {/* Name + secondary metric (kept away from the primary value) */}
              <View className="flex-1" style={{ gap: 2 }}>
                <Text
                  className="text-[15px] font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {member.name.split(" ")[0]}
                </Text>
                <Text className="text-xs font-medium text-muted">{caption}</Text>
              </View>

              {/* Primary value — the single interactive target per row */}
              {splitType === "equal" ? (
                <Text className="text-lg font-bold text-foreground">
                  {rupee(equalShare)}
                </Text>
              ) : splitType === "percentage" ? (
                <View
                  className="flex-row items-baseline border-b-2 border-foreground/15 pb-0.5"
                  style={{ minWidth: 58, justifyContent: "flex-end" }}
                >
                  <TextInput
                    value={String(pct)}
                    onChangeText={(t) => {
                      const num = parseInt(t.replace(/[^0-9]/g, ""), 10);
                      if (!isNaN(num) && num >= 0 && num <= 100)
                        setPercentage(member.id, num);
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                    selectTextOnFocus
                    style={{
                      fontFamily: "Outfit_700Bold",
                      fontSize: 18,
                      color: fgColor,
                      textAlign: "right",
                      padding: 0,
                      minWidth: 22,
                    }}
                  />
                  <Text className="ml-0.5 text-base font-bold text-muted">%</Text>
                </View>
              ) : (
                <View
                  className="flex-row items-baseline border-b-2 border-foreground/15 pb-0.5"
                  style={{ minWidth: 62, justifyContent: "flex-end" }}
                >
                  <Text className="mr-0.5 text-base font-bold text-muted">₹</Text>
                  <TextInput
                    value={String(Math.round(custom))}
                    onChangeText={(t) => {
                      const num = parseFloat(t.replace(/[^0-9.]/g, ""));
                      if (!isNaN(num)) setCustomAmount(member.id, num);
                    }}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                    style={{
                      fontFamily: "Outfit_700Bold",
                      fontSize: 18,
                      color: fgColor,
                      textAlign: "right",
                      padding: 0,
                      minWidth: 40,
                    }}
                  />
                </View>
              )}
            </View>
            {!isLast && <View className="mx-4 h-px bg-border" />}
          </View>
        );
      })}
    </Animated.View>
  );
}
