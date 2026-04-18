import React, { useState } from "react";
import {
  View, Text, Pressable, ScrollView, StyleSheet,
} from "react-native";
import { BottomSheet } from "heroui-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";
import Animated, { FadeIn } from "react-native-reanimated";

import { useSliceFlowStore } from "../../hooks/use-slice-flow-store";
import { mockGroups } from "../../slice-flow.data";
import { MemberAvatarRow } from "./member-avatar-row";
import { SplitTypeTabs } from "./split-type-tabs";
import { MemberSplitList } from "./member-split-list";
import { GroupSelectionSheet } from "./group-selection-sheet";

interface SplitConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SplitConfigSheet({ isOpen, onOpenChange }: SplitConfigSheetProps) {
  const {
    amount,
    groupId, setGroupId,
    selectedMemberIds, toggleMember, setSelectedMembers,
    splitType, setSplitType,
    percentages, setPercentage,
    customAmounts, setCustomAmount,
  } = useSliceFlowStore();

  const [isGroupSheetOpen, setIsGroupSheetOpen] = useState(false);
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000000");
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const totalAmount = parseFloat(amount) || 0;
  const selectedGroup = mockGroups.find((g) => g.id === groupId) ?? null;
  const selectedMembers = (selectedGroup?.members ?? []).filter((m) =>
    selectedMemberIds.includes(m.id),
  );

  const handleGroupSelect = (gId: string) => {
    setGroupId(gId);
    const group = mockGroups.find((g) => g.id === gId);
    if (group) setSelectedMembers(group.members.map((m) => m.id));
  };

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onOpenChange(false);
  };

  const formatRupee = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <>
      <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content
            className="bg-background"
            contentContainerClassName="pt-2 pb-0"
          >
            {/* Header */}
            <View className="flex-row items-start justify-between px-6 pb-4 pt-2">
              <View className="gap-0.5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  New Transaction
                </Text>
                <Text className="text-2xl font-bold text-foreground">Split With</Text>
              </View>
              <Pressable
                onPress={() => onOpenChange(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-card active:opacity-70"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={18} color={fgColor} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 160, gap: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Group Selector */}
              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Select Group
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsGroupSheetOpen(true);
                  }}
                  className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-xl leading-none">
                      {selectedGroup?.emoji ?? "👥"}
                    </Text>
                    <Text
                      className={
                        selectedGroup
                          ? "text-base font-medium text-foreground"
                          : "text-base font-medium text-muted"
                      }
                    >
                      {selectedGroup?.name ?? "Select a group"}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={mutedColor} />
                </Pressable>
              </View>

              {/* Member Avatar Row — appears after group selected */}
              {selectedGroup && (
                <Animated.View entering={FadeIn.duration(250)}>
                  <MemberAvatarRow
                    members={selectedGroup.members}
                    selectedMemberIds={selectedMemberIds}
                    onToggleMember={toggleMember}
                  />
                </Animated.View>
              )}

              {/* Split Type Tabs — appears after group selected */}
              {selectedGroup && (
                <Animated.View entering={FadeIn.duration(250)} className="gap-2">
                  <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Split Type
                  </Text>
                  <SplitTypeTabs splitType={splitType} onSplitTypeChange={setSplitType} />
                </Animated.View>
              )}

              {/* Member Split List — appears after members selected */}
              {selectedMembers.length > 0 && (
                <Animated.View entering={FadeIn.duration(250)}>
                  <MemberSplitList
                    members={selectedMembers}
                    splitType={splitType}
                    totalAmount={totalAmount}
                    percentages={percentages}
                    customAmounts={customAmounts}
                    onPercentageChange={setPercentage}
                    onCustomAmountChange={setCustomAmount}
                  />
                </Animated.View>
              )}
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View
              style={styles.stickyBar}
              className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pb-10 pt-4"
            >
              <View className="mb-3 flex-row items-baseline gap-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Total Expense
                </Text>
                <Text className="ml-2 text-2xl font-bold text-foreground">
                  {formatRupee(totalAmount)}
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => onOpenChange(false)}
                  className="flex-1 items-center rounded-full border border-border py-3.5 active:opacity-70"
                >
                  <Text className="text-base font-semibold text-foreground">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  disabled={selectedMembers.length === 0}
                  className={
                    selectedMembers.length > 0
                      ? "flex-1 items-center rounded-full py-3.5 active:opacity-80 bg-foreground"
                      : "flex-1 items-center rounded-full py-3.5 active:opacity-80 bg-foreground/30"
                  }
                  style={styles.confirmShadow}
                >
                  <Text className="text-base font-semibold text-background">
                    Confirm Split
                  </Text>
                </Pressable>
              </View>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>

      {/* Nested Group Selector */}
      <GroupSelectionSheet
        isOpen={isGroupSheetOpen}
        onOpenChange={setIsGroupSheetOpen}
        groups={mockGroups}
        selectedGroupId={groupId}
        onSelect={handleGroupSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stickyBar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
