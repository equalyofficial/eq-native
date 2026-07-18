import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { TabProfileButton } from "@/components/tab-profile-button";

import { AmountBillboard } from "../components/amount-billboard";
import { CategoryRibbon } from "../components/category-ribbon";
import { PrecisionNumpad } from "../components/precision-numpad";
import { SliceCTAButton } from "../components/slice-cta-button";
import { CategorySelectionSheet } from "../components/category-selection-sheet";
import { useSliceInput } from "../hooks/use-slice-input";

export default function SliceScreen() {
  const insets = useSafeAreaInsets();
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const { amount, appendDigit, deleteLast, clear } = useSliceInput(() => {
    setShakeTrigger((prev) => prev + 1);
  });

  const [category, setCategory] = useState("food_and_dining");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const hasAmount = parseFloat(amount.replace(/,/g, "")) > 0;

  const handleContinue = () => {
    if (!hasAmount) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(protected)/expense-details",
      params: { amount: amount.replace(/,/g, ""), category },
    });
  };

  const bottomClearance = insets.bottom + 128;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-4xl font-bold tracking-tight text-foreground">
            Slice
          </Text>
          <TabProfileButton />
        </View>

        <View className="flex-1 px-5" style={{ paddingBottom: bottomClearance }}>
          <AmountBillboard amount={amount} shakeTrigger={shakeTrigger} />

          <View className="mt-auto gap-3">
            <CategoryRibbon
              selectedCategory={category}
              onSelectCategory={setCategory}
              onMorePress={() => setIsSheetOpen(true)}
            />
            <PrecisionNumpad
              onDigitPress={appendDigit}
              onDelete={deleteLast}
              onClear={clear}
            />
            <SliceCTAButton isEnabled={hasAmount} onPress={handleContinue} />
          </View>
        </View>
      </SafeAreaView>

      <CategorySelectionSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedCategory={category}
        onSelect={setCategory}
      />
    </View>
  );
}
