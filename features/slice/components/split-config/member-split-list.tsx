import React from "react";
import { View, Text, Image, TextInput } from "react-native";
import { useCSSVariable } from "uniwind";
import type { MockMember } from "../../slice-flow.data";
import type { SplitType } from "../../hooks/use-slice-flow-store";

interface MemberSplitListProps {
  members: MockMember[];
  splitType: SplitType;
  totalAmount: number;
  percentages: Record<string, number>;
  customAmounts: Record<string, number>;
  onPercentageChange: (memberId: string, value: number) => void;
  onCustomAmountChange: (memberId: string, value: number) => void;
}

function formatRupee(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function MemberSplitList({
  members,
  splitType,
  totalAmount,
  percentages,
  customAmounts,
  onPercentageChange,
  onCustomAmountChange,
}: MemberSplitListProps) {
  const primaryColor = String(useCSSVariable("--color-primary") ?? "#4f46e5");
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000000");

  const equalShare = members.length > 0 ? totalAmount / members.length : 0;

  return (
    <View className="gap-2">
      {members.map((member) => {
        const firstName = member.name.split(" ")[0] ?? member.name;

        let amountDisplay = "";
        let portionLabel = "";

        if (splitType === "equal") {
          amountDisplay = formatRupee(equalShare);
          portionLabel = `1/${members.length} PORTION`;
        } else if (splitType === "percentage") {
          const pct = percentages[member.id] ?? Math.round(100 / members.length);
          amountDisplay = formatRupee((totalAmount * pct) / 100);
          portionLabel = `${pct}%`;
        } else {
          const custom = customAmounts[member.id] ?? equalShare;
          amountDisplay = formatRupee(custom);
          portionLabel = "CUSTOM";
        }

        return (
          <View
            key={member.id}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3"
          >
            <Image
              source={{ uri: member.avatarUrl }}
              className="h-10 w-10 rounded-full"
            />
            <View className="flex-1 gap-0.5">
              <Text className="text-base font-semibold text-foreground">{firstName}</Text>
              {splitType === "percentage" ? (
                <View className="flex-row items-center gap-1">
                  <TextInput
                    value={String(percentages[member.id] ?? Math.round(100 / members.length))}
                    onChangeText={(t) => {
                      const n = parseInt(t.replace(/[^0-9]/g, ""), 10);
                      if (!isNaN(n) && n >= 0 && n <= 100) {
                        onPercentageChange(member.id, n);
                      }
                    }}
                    keyboardType="number-pad"
                    style={{ fontFamily: "Outfit_400Regular", minWidth: 28, color: primaryColor }}
                    maxLength={3}
                  />
                  <Text className="text-xs font-semibold text-primary">% PORTION</Text>
                </View>
              ) : splitType === "custom" ? (
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-muted">₹</Text>
                  <TextInput
                    value={String(
                      customAmounts[member.id] !== undefined
                        ? customAmounts[member.id]!.toFixed(0)
                        : equalShare.toFixed(0),
                    )}
                    onChangeText={(t) => {
                      const n = parseFloat(t.replace(/[^0-9.]/g, ""));
                      if (!isNaN(n)) onCustomAmountChange(member.id, n);
                    }}
                    keyboardType="decimal-pad"
                    style={{ fontFamily: "Outfit_400Regular", minWidth: 40, color: primaryColor }}
                  />
                  <Text className="text-xs font-semibold text-primary">CUSTOM</Text>
                </View>
              ) : (
                <Text className="text-xs font-semibold text-primary">{portionLabel}</Text>
              )}
            </View>
            <Text className="text-base font-bold text-foreground">{amountDisplay}</Text>
          </View>
        );
      })}
    </View>
  );
}
