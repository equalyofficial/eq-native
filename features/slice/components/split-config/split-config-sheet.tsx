import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { BottomSheet } from "heroui-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import { useSliceFlowStore } from "../../hooks/use-slice-flow-store";
import { mockGroups } from "../../slice-flow.data";
import { MemberGrid } from "./member-grid";
import { SplitTypeTabs } from "./split-type-tabs";
import { GroupSelectionSheet } from "./group-selection-sheet";

const SPRING_LAYOUT = LinearTransition.duration(220);
const FADE_IN = FadeIn.duration(200);

interface SplitConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SplitConfigSheet({
  isOpen,
  onOpenChange,
}: SplitConfigSheetProps) {
  const {
    amount,
    groupId,
    setGroupId,
    selectedMemberIds,
    toggleMember,
    setSelectedMembers,
    splitType,
    setSplitType,
    percentages,
    setPercentage,
    customAmounts,
    setCustomAmount,
  } = useSliceFlowStore();

  const [isGroupSheetOpen, setIsGroupSheetOpen] = useState(false);

  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000");
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const totalAmount = parseFloat(amount) || 0;
  const selectedGroup = mockGroups.find((g) => g.id === groupId) ?? null;
  const selectedMembers = (selectedGroup?.members ?? []).filter((m) =>
    selectedMemberIds.includes(m.id),
  );
  const equalShare =
    selectedMembers.length > 0 ? totalAmount / selectedMembers.length : 0;

  const allSelected =
    selectedGroup !== null &&
    selectedGroup.members.every((m) => selectedMemberIds.includes(m.id));

  const handleGroupSelect = (gId: string) => {
    setGroupId(gId);
    const group = mockGroups.find((g) => g.id === gId);
    if (group) setSelectedMembers(group.members.map((m) => m.id));
  };

  const handleToggleAll = () => {
    if (!selectedGroup) return;
    if (allSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(selectedGroup.members.map((m) => m.id));
    }
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

  const summaryText =
    selectedMembers.length === 0
      ? "Select members to continue"
      : splitType === "equal"
        ? `${formatRupee(equalShare)} each · ${selectedMembers.length} ${selectedMembers.length === 1 ? "person" : "people"}`
        : `${selectedMembers.length} ${selectedMembers.length === 1 ? "person" : "people"} · Custom split`;

  return (
    <>
      <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay className="bg-black/40" />
          <BottomSheet.Content
            backgroundClassName="rounded-t-[2.5rem] bg-background"
            className="bg-background"
            contentContainerClassName="pt-2 pb-0"
          >
            {/* ── Header ── */}
            <View className="flex-row items-center justify-between px-6 pt-3 pb-5">
              <View style={{ gap: 2 }}>
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Splitting
                </Text>
                <View
                  className="flex-row items-center"
                  style={{ gap: 10, marginTop: 2 }}
                >
                  <Text className="text-2xl font-bold text-foreground">
                    Split With
                  </Text>
                  {totalAmount > 0 && (
                    <View
                      className="rounded-full bg-foreground"
                      style={{ paddingHorizontal: 12, paddingVertical: 4 }}
                    >
                      <Text className="text-xs font-bold text-background">
                        {formatRupee(totalAmount)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Pressable
                onPress={() => onOpenChange(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-card active:opacity-70"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={18} color={fgColor} />
              </Pressable>
            </View>

            {/* ── Scrollable body ── */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 148,
                gap: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Group selector */}
              <Animated.View layout={SPRING_LAYOUT} style={{ gap: 8 }}>
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Group
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsGroupSheetOpen(true);
                  }}
                  className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 active:opacity-80"
                >
                  <View className="flex-row items-center" style={{ gap: 12 }}>
                    <Text className="text-xl leading-none">
                      {selectedGroup?.emoji ?? "👥"}
                    </Text>
                    <Text
                      className={
                        selectedGroup
                          ? "text-base font-semibold text-foreground"
                          : "text-base font-medium text-muted"
                      }
                    >
                      {selectedGroup?.name ?? "Select a group"}
                    </Text>
                  </View>
                  <View className="flex-row items-center" style={{ gap: 8 }}>
                    {selectedGroup && (
                      <Text className="text-xs text-muted">
                        {selectedGroup.members.length} members
                      </Text>
                    )}
                    <Feather name="chevron-right" size={16} color={mutedColor} />
                  </View>
                </Pressable>
              </Animated.View>

              {/* Members + split config — revealed after group selection */}
              {selectedGroup && (
                <Animated.View
                  entering={FADE_IN}
                  exiting={FadeOut.duration(150)}
                  layout={SPRING_LAYOUT}
                  style={{ gap: 20 }}
                >
                  {/* Member section header */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                      Members
                    </Text>
                    <Pressable onPress={handleToggleAll} hitSlop={8}>
                      <Text className="text-xs font-semibold text-primary">
                        {allSelected ? "Deselect all" : "Select all"}
                      </Text>
                    </Pressable>
                  </View>

                  {/* 2-column avatar grid */}
                  <MemberGrid
                    members={selectedGroup.members}
                    selectedMemberIds={selectedMemberIds}
                    onToggleMember={toggleMember}
                    splitType={splitType}
                    totalAmount={totalAmount}
                    percentages={percentages}
                    customAmounts={customAmounts}
                  />

                  {/* Split type tabs with animated indicator */}
                  <Animated.View layout={SPRING_LAYOUT} style={{ gap: 8 }}>
                    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                      Split Type
                    </Text>
                    <SplitTypeTabs
                      splitType={splitType}
                      onSplitTypeChange={setSplitType}
                    />
                  </Animated.View>

                  {/* Compact input rows — only for percentage or custom splits */}
                  {splitType !== "equal" && selectedMembers.length > 0 && (
                    <Animated.View
                      entering={FADE_IN}
                      exiting={FadeOut.duration(120)}
                      layout={SPRING_LAYOUT}
                      style={{ gap: 8 }}
                    >
                      <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                        Amounts
                      </Text>
                      <View className="rounded-2xl bg-card overflow-hidden">
                        {selectedMembers.map((member, index) => {
                          const isLast = index === selectedMembers.length - 1;
                          const pct =
                            percentages[member.id] ??
                            Math.round(100 / selectedMembers.length);
                          const custom =
                            customAmounts[member.id] !== undefined
                              ? customAmounts[member.id]!
                              : equalShare;
                          const displayAmount =
                            splitType === "percentage"
                              ? formatRupee((totalAmount * pct) / 100)
                              : formatRupee(custom);

                          return (
                            <View key={member.id}>
                              <View
                                className="flex-row items-center px-4 py-3"
                                style={{ gap: 12 }}
                              >
                                <Image
                                  source={{ uri: member.avatarUrl }}
                                  className="h-8 w-8 rounded-full"
                                />
                                <Text
                                  className="flex-1 text-sm font-medium text-foreground"
                                  numberOfLines={1}
                                >
                                  {member.name.split(" ")[0]}
                                </Text>

                                {/* Editable input pill */}
                                {splitType === "percentage" ? (
                                  <View
                                    className="flex-row items-center rounded-xl bg-background"
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingVertical: 6,
                                      gap: 2,
                                    }}
                                  >
                                    <TextInput
                                      value={String(pct)}
                                      onChangeText={(t) => {
                                        const n = parseInt(
                                          t.replace(/[^0-9]/g, ""),
                                          10,
                                        );
                                        if (!isNaN(n) && n >= 0 && n <= 100)
                                          setPercentage(member.id, n);
                                      }}
                                      keyboardType="number-pad"
                                      maxLength={3}
                                      style={{
                                        fontFamily: "Outfit_600SemiBold",
                                        fontSize: 14,
                                        color: fgColor,
                                        minWidth: 28,
                                        textAlign: "right",
                                      }}
                                    />
                                    <Text className="text-sm font-semibold text-muted">
                                      %
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    className="flex-row items-center rounded-xl bg-background"
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingVertical: 6,
                                      gap: 2,
                                    }}
                                  >
                                    <Text className="text-sm text-muted">₹</Text>
                                    <TextInput
                                      value={String(Math.round(custom))}
                                      onChangeText={(t) => {
                                        const n = parseFloat(
                                          t.replace(/[^0-9.]/g, ""),
                                        );
                                        if (!isNaN(n))
                                          setCustomAmount(member.id, n);
                                      }}
                                      keyboardType="decimal-pad"
                                      style={{
                                        fontFamily: "Outfit_600SemiBold",
                                        fontSize: 14,
                                        color: fgColor,
                                        minWidth: 40,
                                        textAlign: "right",
                                      }}
                                    />
                                  </View>
                                )}

                                <Text
                                  className="text-sm font-bold text-foreground"
                                  style={{ minWidth: 60, textAlign: "right" }}
                                >
                                  {displayAmount}
                                </Text>
                              </View>
                              {!isLast && (
                                <View className="mx-4 h-px bg-border" />
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </Animated.View>
                  )}
                </Animated.View>
              )}
            </ScrollView>

            {/* ── Sticky bottom bar ── */}
            <View
              style={styles.stickyBar}
              className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-10 pt-4"
            >
              <Text
                className="text-sm font-medium text-muted text-center mb-3"
                numberOfLines={1}
              >
                {summaryText}
              </Text>
              <View className="flex-row" style={{ gap: 12 }}>
                <Pressable
                  onPress={() => onOpenChange(false)}
                  className="flex-1 items-center rounded-full border border-border py-3.5 active:opacity-70"
                >
                  <Text className="text-base font-semibold text-foreground">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  disabled={selectedMembers.length === 0}
                  className={
                    selectedMembers.length > 0
                      ? "items-center rounded-full py-3.5 bg-foreground active:opacity-80"
                      : "items-center rounded-full py-3.5 bg-foreground/30"
                  }
                  style={[{ flex: 2 }, styles.confirmShadow]}
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
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
