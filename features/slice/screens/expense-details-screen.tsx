import React, { useEffect, useState } from "react";
import {
  View, Text, Pressable, ScrollView, KeyboardAvoidingView,
  Platform, Image, StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";
import Animated, { FadeIn } from "react-native-reanimated";

import { TabProfileButton } from "@/components/tab-profile-button";
import { useSliceFlowStore } from "../hooks/use-slice-flow-store";
import { mockGroups, getPlaceholders } from "../slice-flow.data";

import { ExpenseSummaryHero } from "../components/expense-summary/expense-summary-hero";
import { AnimatedPlaceholderInput } from "../components/expense-description/animated-placeholder-input";
import { DateSelector } from "../components/split-config/date-selector";
import { SplitConfigSheet } from "../components/split-config/split-config-sheet";
import { BillUploadSheet } from "../components/bill-upload/bill-upload-sheet";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatRupee(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
      {label}
    </Text>
  );
}

// ─── Split With card ─────────────────────────────────────────────────────────

function SplitWithCard({ onPress }: { onPress: () => void }) {
  const { amount, groupId, selectedMemberIds, splitType } = useSliceFlowStore();
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const selectedGroup = mockGroups.find((g) => g.id === groupId) ?? null;
  const selectedMembers = (selectedGroup?.members ?? []).filter((m) =>
    selectedMemberIds.includes(m.id),
  );
  const totalAmount = parseFloat(amount) || 0;
  const perPerson = selectedMembers.length > 0 ? totalAmount / selectedMembers.length : 0;
  const splitBadgeLabel =
    splitType === "equal" ? "Equally" : splitType === "percentage" ? "By %" : "Custom";
  const hasSelection = selectedMembers.length > 0;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="rounded-2xl border border-border bg-card px-4 py-4 active:opacity-80"
      style={styles.cardShadow}
    >
      {!hasSelection ? (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
              <Feather name="users" size={18} color={mutedColor} />
            </View>
            <Text className="text-base text-muted">Tap to split expense</Text>
          </View>
          <Feather name="chevron-right" size={18} color={mutedColor} />
        </View>
      ) : (
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            {/* Avatar stack */}
            <View className="flex-row items-center">
              {selectedMembers.slice(0, 4).map((member, i) => (
                <Image
                  key={member.id}
                  source={{ uri: member.avatarUrl }}
                  className="h-9 w-9 rounded-full border-2 border-background"
                  style={{ marginLeft: i > 0 ? -10 : 0 }}
                />
              ))}
              {selectedMembers.length > 4 && (
                <View
                  className="h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-card"
                  style={{ marginLeft: -10 }}
                >
                  <Text className="text-[10px] font-semibold text-muted">
                    +{selectedMembers.length - 4}
                  </Text>
                </View>
              )}
            </View>
            {/* Split badge + chevron */}
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-foreground px-3 py-1">
                <Text className="text-xs font-semibold uppercase text-background">
                  {splitBadgeLabel}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={mutedColor} />
            </View>
          </View>
          {/* Per-person amount */}
          <Text className="text-xs text-muted">
            {splitType === "equal"
              ? `Per person ${formatRupee(perPerson)} · `
              : splitType === "percentage"
              ? "Split by percentage · "
              : "Custom amounts · "}
            {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Bill card ────────────────────────────────────────────────────────────────

function BillCard({ onPress }: { onPress: () => void }) {
  const { billImageUri } = useSliceFlowStore();
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="flex-1 rounded-2xl border border-border bg-card px-4 py-4 active:opacity-80"
      style={styles.cardShadow}
    >
      {billImageUri ? (
        <View className="gap-1.5">
          <View className="overflow-hidden rounded-xl" style={{ height: 56 }}>
            <Image
              source={{ uri: billImageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <Text className="text-xs font-semibold text-primary">Bill Added ✓</Text>
        </View>
      ) : (
        <View className="gap-1.5">
          <Feather name="file-text" size={20} color={mutedColor} />
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
            Bill
          </Text>
          <Text className="text-xs text-muted opacity-70">Optional</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Date card ────────────────────────────────────────────────────────────────

function DateCard({ date, onPress }: { date: Date; onPress: () => void }) {
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const label = isToday
    ? "Today"
    : isYesterday
    ? "Yesterday"
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="flex-1 rounded-2xl border border-border bg-card px-4 py-4 active:opacity-80"
      style={styles.cardShadow}
    >
      <View className="gap-1.5">
        <Feather name="calendar" size={20} color={mutedColor} />
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          Date
        </Text>
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ExpenseDetailsScreen() {
  const params = useLocalSearchParams<{ amount: string; category: string }>();
  const insets = useSafeAreaInsets();
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000000");
  const bgColor = String(useCSSVariable("--color-background") ?? "#ffffff");

  const {
    amount, category, description, setDescription,
    date, setDate, groupId, selectedMemberIds,
    resetFlow, initFlow,
  } = useSliceFlowStore();

  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [isBillSheetOpen, setIsBillSheetOpen] = useState(false);
  const [isDateExpanded, setIsDateExpanded] = useState(false);

  useEffect(() => {
    if (params.amount && params.category) {
      initFlow(params.amount, params.category);
    }
  }, []);

  const isCTAEnabled =
    description.trim().length > 0 && groupId !== null && selectedMemberIds.length > 0;

  const handleCreateExpense = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetFlow();
    router.back();
  };

  const placeholders = getPlaceholders(category);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
          <Pressable
            onPress={() => {
              resetFlow();
              router.back();
            }}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-foreground/5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={22} color={fgColor} />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground">Expense Details</Text>
          <TabProfileButton />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Amount Hero */}
            <ExpenseSummaryHero amount={amount} category={category} />

            {/* Divider */}
            <View className="mx-6 mb-6 h-px bg-border" />

            <View className="gap-5 px-5">
              {/* Description */}
              <View>
                <SectionLabel label="What was it for?" />
                <AnimatedPlaceholderInput
                  value={description}
                  onChangeText={setDescription}
                  placeholders={placeholders}
                />
              </View>

              {/* Split With */}
              <View>
                <SectionLabel label="Split With" />
                <SplitWithCard onPress={() => setIsSplitSheetOpen(true)} />
              </View>

              {/* Date + Bill row */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <SectionLabel label="Date" />
                  <DateCard date={date} onPress={() => setIsDateExpanded((v) => !v)} />
                </View>
                <View className="flex-1">
                  <SectionLabel label="Bill" />
                  <BillCard onPress={() => setIsBillSheetOpen(true)} />
                </View>
              </View>

              {/* Inline date selector — expands when DateCard is tapped */}
              {isDateExpanded && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  className="rounded-2xl border border-border bg-card px-4 py-4"
                >
                  <DateSelector
                    date={date}
                    onDateChange={(d) => {
                      setDate(d);
                      setIsDateExpanded(false);
                    }}
                  />
                </Animated.View>
              )}
            </View>
          </ScrollView>

          {/* CTA */}
          <View
            className="px-5 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <View style={[styles.ctaShadow, { shadowColor: fgColor }]}>
              <Pressable
                onPress={handleCreateExpense}
                disabled={!isCTAEnabled}
                className={
                  isCTAEnabled
                    ? "flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-90 bg-foreground"
                    : "flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-90 bg-foreground/20"
                }
              >
                <Text
                  className={
                    isCTAEnabled
                      ? "text-lg font-semibold text-background"
                      : "text-lg font-semibold text-foreground/40"
                  }
                >
                  Create Expense
                </Text>
                {isCTAEnabled && (
                  <Feather name="arrow-right" size={18} color={bgColor} />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Sheets */}
        <SplitConfigSheet isOpen={isSplitSheetOpen} onOpenChange={setIsSplitSheetOpen} />
        <BillUploadSheet isOpen={isBillSheetOpen} onOpenChange={setIsBillSheetOpen} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
