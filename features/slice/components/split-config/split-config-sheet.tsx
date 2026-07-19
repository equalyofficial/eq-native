import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { BottomSheet } from "heroui-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import { useSliceFlowStore } from "../../hooks/use-slice-flow-store";
import { mockGroups, mockMembers } from "../../slice-flow.data";
import { SplitTypeTabs } from "./split-type-tabs";
import { SplitBreakdown } from "./split-breakdown";
import { MemberSelectGrid } from "./member-select-grid";
import { MemberSelectSheet } from "./member-select-sheet";
import { SegmentToggle } from "@/features/balances/components/segment-toggle";
import { SwipeSwitch } from "@/components/swipe-switch";
import { useSheetAnimation } from "@/hooks/use-sheet-animation";
import type { SplitType } from "../../hooks/use-slice-flow-store";

const SPLIT_ORDER: SplitType[] = ["equal", "percentage", "custom"];

const SPRING_LAYOUT = LinearTransition.duration(240).easing(
  Easing.out(Easing.cubic),
);
const FADE_IN = FadeIn.duration(220).easing(Easing.out(Easing.cubic));

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

  const [source, setSource] = useState<"groups" | "users">("groups");
  const [userStep, setUserStep] = useState<"select" | "configure">("select");
  const [isMemberSheetOpen, setIsMemberSheetOpen] = useState(false);

  const animationConfigs = useSheetAnimation();

  // Reveal the body only after the sheet has finished sliding up, so the
  // content animations don't fight the entrance and cause jitter.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setRevealed(false);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, [isOpen]);

  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000");
  const bgColor = String(useCSSVariable("--color-background") ?? "#fff");
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const totalAmount = parseFloat(amount) || 0;
  const selectedGroup = mockGroups.find((g) => g.id === groupId) ?? null;
  const memberPool = selectedGroup ? selectedGroup.members : mockMembers;
  const selectedMembers = memberPool.filter((m) =>
    selectedMemberIds.includes(m.id),
  );

  // Split config (type + amounts) shows once a group's members are chosen, or
  // once the Users flow advances past the selection step.
  const showSplitConfig =
    selectedMembers.length > 0 &&
    (source === "groups" ? !!selectedGroup : userStep === "configure");

  // Users flow, selection step — the bottom CTA advances instead of confirming.
  const isUsersSelectStep = source === "users" && userStep === "select";

  const switchSource = (next: "groups" | "users") => {
    if (next === source) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSource(next);
    if (next === "users") {
      setGroupId(null);
      setSelectedMembers([]);
      setUserStep("select");
    }
  };
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

  const cycleSplit = (dir: 1 | -1) => {
    const i = SPLIT_ORDER.indexOf(splitType);
    const next = i + dir;
    if (next < 0 || next >= SPLIT_ORDER.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSplitType(SPLIT_ORDER[next]);
  };

  const formatRupee = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const peopleLabel = `${selectedMembers.length} ${
    selectedMembers.length === 1 ? "person" : "people"
  }`;
  const summaryText =
    selectedMembers.length === 0
      ? source === "users"
        ? "Select people to continue"
        : "Select members to continue"
      : isUsersSelectStep
        ? `${peopleLabel} selected`
        : splitType === "equal"
          ? `${formatRupee(equalShare)} each · ${peopleLabel}`
          : `${peopleLabel} · Custom split`;

  return (
    <>
      <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay className="bg-black/40" />
          <BottomSheet.Content
            snapPoints={["90%"]}
            animationConfigs={animationConfigs}
            enableOverDrag={false}
            enableDynamicSizing={false}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            backgroundClassName="rounded-t-3xl bg-background"
            contentContainerClassName="pt-2 pb-0 h-full"
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
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 148,
                gap: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {revealed && (
              <>
              {/* Source toggle — hidden once a group is locked in */}
              {!selectedGroup && (
                <Animated.View entering={FADE_IN} layout={SPRING_LAYOUT}>
                  <SegmentToggle
                    options={[
                      { value: "groups", label: "Groups" },
                      { value: "users", label: "Users" },
                    ]}
                    value={source}
                    onChange={switchSource}
                  />
                </Animated.View>
              )}

              {/* Groups mode — inline group list. Swipe left to jump to Users. */}
              {source === "groups" && !selectedGroup && (
                <SwipeSwitch
                  onNext={() => switchSource("users")}
                  onPrev={() => switchSource("groups")}
                >
                <Animated.View
                  entering={FADE_IN}
                  layout={SPRING_LAYOUT}
                  style={{ gap: 8 }}
                >
                  <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Your Groups
                  </Text>
                  {mockGroups.map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleGroupSelect(g.id);
                        setIsMemberSheetOpen(true);
                      }}
                      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
                    >
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-background">
                        <Text className="text-xl leading-none">{g.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {g.name}
                        </Text>
                        <Text className="text-xs text-muted">
                          {g.members.length} members
                        </Text>
                      </View>
                      <View className="flex-row -space-x-2">
                        {g.members.slice(0, 3).map((m, i) => (
                          <Image
                            key={m.id}
                            source={{ uri: m.avatarUrl }}
                            className="h-7 w-7 rounded-full border-2 border-card"
                            style={{ marginLeft: i > 0 ? -8 : 0 }}
                          />
                        ))}
                      </View>
                      <Feather name="chevron-right" size={16} color={mutedColor} />
                    </Pressable>
                  ))}
                </Animated.View>
                </SwipeSwitch>
              )}

              {/* Groups mode — one compact card: group + members combined */}
              {source === "groups" && selectedGroup && (
                <Animated.View
                  entering={FADE_IN}
                  layout={SPRING_LAYOUT}
                >
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsMemberSheetOpen(true);
                    }}
                    className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 active:opacity-80"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-background">
                      <Text className="text-lg leading-none">
                        {selectedGroup.emoji}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text
                        className="text-base font-semibold text-foreground"
                        numberOfLines={1}
                      >
                        {selectedGroup.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {selectedMembers.length} of {selectedGroup.members.length}{" "}
                        selected
                      </Text>
                    </View>

                    {selectedMembers.length > 0 && (
                      <View className="flex-row -space-x-2">
                        {selectedMembers.slice(0, 3).map((m, i) => (
                          <Image
                            key={m.id}
                            source={{ uri: m.avatarUrl }}
                            className="h-8 w-8 rounded-full border-2 border-card"
                            style={{ marginLeft: i > 0 ? -8 : 0 }}
                          />
                        ))}
                        {selectedMembers.length > 3 && (
                          <View
                            className="h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-background"
                            style={{ marginLeft: -8 }}
                          >
                            <Text className="text-[10px] font-bold text-muted">
                              +{selectedMembers.length - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Switch group */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.selectionAsync();
                        setGroupId(null);
                        setSelectedMembers([]);
                      }}
                      hitSlop={8}
                      className="h-8 w-8 items-center justify-center rounded-full bg-background active:opacity-70"
                    >
                      <Feather name="repeat" size={15} color={fgColor} />
                    </Pressable>
                  </Pressable>
                </Animated.View>
              )}

              {/* Users mode · select step — people shown inline, directly
                  selectable. Swipe right anywhere here to go back to Groups. */}
              {source === "users" && userStep === "select" && (
                <SwipeSwitch
                  onNext={() => switchSource("users")}
                  onPrev={() => switchSource("groups")}
                >
                <Animated.View
                  entering={FADE_IN}
                  exiting={FadeOut.duration(150)}
                  layout={SPRING_LAYOUT}
                  style={{ gap: 10 }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                      People
                    </Text>
                    {selectedMembers.length > 0 && (
                      <Text className="text-xs font-semibold text-muted">
                        {selectedMembers.length} selected
                      </Text>
                    )}
                  </View>
                  <MemberSelectGrid
                    members={mockMembers}
                    selectedIds={selectedMemberIds}
                    onToggle={toggleMember}
                    onInvite={() => Haptics.selectionAsync()}
                  />
                </Animated.View>
                </SwipeSwitch>
              )}

              {/* Users mode · configure step — compact summary, tap to edit. */}
              {source === "users" && userStep === "configure" && (
                <Animated.View entering={FADE_IN} layout={SPRING_LAYOUT}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setUserStep("select");
                    }}
                    className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 active:opacity-80"
                  >
                    <View className="flex-row -space-x-2">
                      {selectedMembers.slice(0, 4).map((m, i) => (
                        <Image
                          key={m.id}
                          source={{ uri: m.avatarUrl }}
                          className="h-9 w-9 rounded-full border-2 border-card"
                          style={{ marginLeft: i > 0 ? -9 : 0 }}
                        />
                      ))}
                      {selectedMembers.length > 4 && (
                        <View
                          className="h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-background"
                          style={{ marginLeft: -9 }}
                        >
                          <Text className="text-[10px] font-bold text-muted">
                            +{selectedMembers.length - 4}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {selectedMembers.length}{" "}
                        {selectedMembers.length === 1 ? "person" : "people"}
                      </Text>
                      <Text className="text-xs text-muted">Tap to add or edit</Text>
                    </View>

                    <View className="flex-row items-center gap-1 rounded-full bg-background px-3 py-1.5">
                      <Feather name="edit-2" size={12} color={mutedColor} />
                      <Text className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Edit
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              )}

              {/* Split type — once the split config is unlocked. Swipe
                  left/right anywhere in this region to cycle split types. */}
              {showSplitConfig && (
                <SwipeSwitch
                  onNext={() => cycleSplit(1)}
                  onPrev={() => cycleSplit(-1)}
                >
                <Animated.View
                  entering={FADE_IN}
                  layout={SPRING_LAYOUT}
                  style={{ gap: 20 }}
                >
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

                  {/* Per-person split breakdown — shown for all split types */}
                  {selectedMembers.length > 0 && (
                    <Animated.View
                      entering={FADE_IN}
                      exiting={FadeOut.duration(120)}
                      layout={SPRING_LAYOUT}
                    >
                      <SplitBreakdown
                        members={selectedMembers}
                        splitType={splitType}
                        totalAmount={totalAmount}
                        equalShare={equalShare}
                        percentages={percentages}
                        customAmounts={customAmounts}
                        setPercentage={setPercentage}
                        setCustomAmount={setCustomAmount}
                      />
                    </Animated.View>
                  )}
                </Animated.View>
                </SwipeSwitch>
              )}
              </>
              )}
            </BottomSheetScrollView>

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
                  onPress={() => {
                    if (isUsersSelectStep) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setUserStep("configure");
                    } else {
                      handleConfirm();
                    }
                  }}
                  disabled={selectedMembers.length === 0}
                  className={
                    selectedMembers.length > 0
                      ? "flex-row items-center justify-center gap-1.5 rounded-full py-3.5 bg-foreground active:opacity-80"
                      : "flex-row items-center justify-center gap-1.5 rounded-full py-3.5 bg-foreground/30"
                  }
                  style={[{ flex: 2 }, styles.confirmShadow]}
                >
                  <Text className="text-base font-semibold text-background">
                    {isUsersSelectStep ? "Continue" : "Confirm Split"}
                  </Text>
                  {isUsersSelectStep && (
                    <Feather name="arrow-right" size={17} color={bgColor} />
                  )}
                </Pressable>
              </View>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>

      <MemberSelectSheet
        isOpen={isMemberSheetOpen}
        onOpenChange={setIsMemberSheetOpen}
        title={source === "groups" ? "Select Members" : "Select People"}
        members={memberPool}
        selectedIds={selectedMemberIds}
        onToggle={toggleMember}
        onInvite={() => Haptics.selectionAsync()}
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
