import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  InteractionManager,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

import { TabProfileButton } from "@/components/tab-profile-button";
import { useSliceFlowStore } from "../hooks/use-slice-flow-store";
import { mockGroups, mockMembers, getPlaceholders } from "../slice-flow.data";
import { ALL_CATEGORIES } from "../components/category-ribbon";

import { ExpenseSummaryHero } from "../components/expense-summary/expense-summary-hero";
import { AnimatedPlaceholderInput } from "../components/expense-description/animated-placeholder-input";
import { DatePickerSheet } from "../components/split-config/date-picker-sheet";
import { SplitConfigSheet } from "../components/split-config/split-config-sheet";
import { BillUploadSheet } from "../components/bill-upload/bill-upload-sheet";
import { CategorySelectionSheet } from "../components/category-selection-sheet";

// ─── Description + Category card ─────────────────────────────────────────────

function DescriptionCard({
  value,
  onChangeText,
  placeholders,
  category,
  onCategoryPress,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholders: string[];
  category: string;
  onCategoryPress: () => void;
}) {
  const categoryData = ALL_CATEGORIES.find((c) => c.id === category);
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  return (
    <View className="rounded-2xl bg-card px-5 pt-5" style={styles.cardShadow}>
      <Text className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        What was it for?
      </Text>
      <AnimatedPlaceholderInput
        value={value}
        onChangeText={onChangeText}
        placeholders={placeholders}
      />
      <View className="mb-0 mt-5 h-px bg-border" />
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onCategoryPress();
        }}
        className="flex-row items-center justify-between py-4 active:opacity-70"
      >
        <View className="gap-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Category
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-base leading-none">
              {categoryData?.icon ?? "📦"}
            </Text>
            <Text className="text-base font-semibold text-foreground">
              {categoryData?.label ?? "Misc"}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={18} color={mutedColor} />
      </Pressable>
    </View>
  );
}

// ─── Split With card ─────────────────────────────────────────────────────────

function SplitWithCard({ onPress }: { onPress: () => void }) {
  const { amount, groupId, selectedMemberIds, splitType } = useSliceFlowStore();
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const selectedGroup = mockGroups.find((g) => g.id === groupId) ?? null;
  const memberPool = selectedGroup ? selectedGroup.members : mockMembers;
  const selectedMembers = memberPool.filter((m) =>
    selectedMemberIds.includes(m.id),
  );
  const hasSelection = selectedMembers.length > 0;

  const perPerson =
    hasSelection && splitType === "equal"
      ? (parseFloat(amount) || 0) / selectedMembers.length
      : null;
  const perPersonLabel =
    perPerson !== null
      ? `₹${perPerson.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
      : "";

  const splitLabel =
    splitType === "equal"
      ? "Equally Split"
      : splitType === "percentage"
        ? "By Percentage"
        : "Custom Amounts";

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="rounded-2xl bg-card px-5 py-5 active:opacity-80"
      style={styles.cardShadow}
    >
      {/* Header row: label + people pill */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Split With
        </Text>
        {hasSelection && (
          <View className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1">
            <Feather name="users" size={11} color={mutedColor} />
            <Text className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {selectedMembers.length} People
            </Text>
          </View>
        )}
      </View>

      {/* Split type label (big) */}
      <Text
        className={
          hasSelection
            ? "text-2xl font-bold tracking-tight text-foreground"
            : "text-2xl font-bold tracking-tight text-muted"
        }
        style={{ opacity: hasSelection ? 1 : 0.4 }}
      >
        {hasSelection ? splitLabel : "Tap to split expense"}
      </Text>

      {/* Avatar row */}
      {hasSelection && (
        <View className="mt-4 flex-row items-end justify-between">
          <View className="flex-row items-center">
            {selectedMembers.slice(0, 4).map((member, i) => (
              <Image
                key={member.id}
                source={{ uri: member.avatarUrl }}
                className="h-9 w-9 rounded-full border-2 border-card"
                style={{ marginLeft: i > 0 ? -10 : 0 }}
              />
            ))}
            {selectedMembers.length > 4 && (
              <View
                className="h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-foreground/10"
                style={{ marginLeft: -10 }}
              >
                <Text className="text-[10px] font-semibold text-muted">
                  +{selectedMembers.length - 4}
                </Text>
              </View>
            )}
          </View>

          {perPerson !== null && (
            <View className="items-end">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Per Person
              </Text>
              <Text className="mt-0.5 text-4xl font-bold tracking-tight text-foreground">
                {perPersonLabel}
              </Text>
            </View>
          )}
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
      className="flex-1 rounded-2xl bg-card px-4 py-4 active:opacity-80"
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
          <Text className="text-xs font-semibold text-primary">
            Bill Added ✓
          </Text>
        </View>
      ) : (
        <View className="gap-1.5">
          <Feather name="file-text" size={20} color={mutedColor} />
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
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
      className="flex-1 rounded-2xl bg-card px-4 py-4 active:opacity-80"
      style={styles.cardShadow}
    >
      <View className="gap-1.5">
        <Feather name="calendar" size={20} color={mutedColor} />
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
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
    amount,
    category,
    setCategory,
    description,
    setDescription,
    date,
    setDate,
    groupId,
    selectedMemberIds,
    resetFlow,
    initFlow,
  } = useSliceFlowStore();

  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [isBillSheetOpen, setIsBillSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);

  const [sheetsReady, setSheetsReady] = useState(false);
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() =>
      setSheetsReady(true),
    );
    return () => task.cancel();
  }, []);

  useEffect(() => {
    if (params.amount && params.category) {
      initFlow(params.amount, params.category);
    }
  }, []);

  const isCTAEnabled =
    description.trim().length > 0 && selectedMemberIds.length > 0;

  const handleCreateExpense = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetFlow();
    router.back();
  };

  const placeholders = getPlaceholders(category);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
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
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Expense Details
          </Text>
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
            style={{ flex: 1 }}
          >
            {/* Amount Hero */}
            <ExpenseSummaryHero amount={amount} />

            {/* Divider */}
            <View className="mx-5 mb-5 h-px bg-border" />

            <View className="gap-4 px-5">
              {/* Description + Category combined card */}
              <DescriptionCard
                value={description}
                onChangeText={setDescription}
                placeholders={placeholders}
                category={category}
                onCategoryPress={() => setIsCategorySheetOpen(true)}
              />

              {/* Split With */}
              <SplitWithCard onPress={() => setIsSplitSheetOpen(true)} />

              {/* Date + Bill row */}
              <View className="flex-row gap-3">
                <DateCard
                  date={date}
                  onPress={() => setIsDateSheetOpen(true)}
                />
                <BillCard onPress={() => setIsBillSheetOpen(true)} />
              </View>
            </View>
          </ScrollView>

          {/* CTA */}
          <View
            className="bg-background px-5 pt-3"
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
                      ? "text-base font-semibold text-background"
                      : "text-base font-semibold text-foreground/40"
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

        {(sheetsReady || isSplitSheetOpen) && (
          <SplitConfigSheet
            isOpen={isSplitSheetOpen}
            onOpenChange={setIsSplitSheetOpen}
          />
        )}
        {(sheetsReady || isBillSheetOpen) && (
          <BillUploadSheet
            isOpen={isBillSheetOpen}
            onOpenChange={setIsBillSheetOpen}
          />
        )}
        {(sheetsReady || isCategorySheetOpen) && (
          <CategorySelectionSheet
            isOpen={isCategorySheetOpen}
            onOpenChange={setIsCategorySheetOpen}
            selectedCategory={category}
            onSelect={setCategory}
          />
        )}
        {(sheetsReady || isDateSheetOpen) && (
          <DatePickerSheet
            isOpen={isDateSheetOpen}
            onOpenChange={setIsDateSheetOpen}
            date={date}
            onDateChange={setDate}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  ctaShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
