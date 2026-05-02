import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { TabProfileButton } from "@/components/tab-profile-button";

import { AmountBillboard } from "../components/amount-billboard";
import { CategoryRibbon } from "../components/category-ribbon";
import { PrecisionNumpad } from "../components/precision-numpad";
import { SliceCTAButton } from "../components/slice-cta-button";
import { CategorySelectionSheet } from "../components/category-selection-sheet";
import { useSliceInput } from "../hooks/use-slice-input";
import { useSliceCTAStore } from "../hooks/use-slice-cta-store";

export default function SliceScreen() {
  const insets = useSafeAreaInsets();
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const { amount, appendDigit, deleteLast, clear } = useSliceInput(() => {
    setShakeTrigger((prev) => prev + 1);
  });

  const [category, setCategory] = useState("food_and_dining");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { activate, deactivate } = useSliceCTAStore();
  const hasAmount = amount !== "0";

  useEffect(() => {
    if (hasAmount) {
      activate(() =>
        router.push({
          pathname: "/(protected)/expense-details",
          params: { amount: amount.replace(/,/g, ""), category },
        }),
      );
    } else {
      deactivate();
    }
    return () => deactivate();
  }, [hasAmount, amount, category, activate, deactivate]);

  const ghostOpacity = useSharedValue(1);
  useEffect(() => {
    ghostOpacity.value = withTiming(hasAmount ? 0 : 1, { duration: 140 });
  }, [hasAmount, ghostOpacity]);
  const ghostStyle = useAnimatedStyle(() => ({ opacity: ghostOpacity.value }));

  // Position the button in the transparent upper region of the tab bar gradient
  const bottomPadding = insets.bottom + 112;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View className="px-5 pt-3 pb-6 flex-row items-center justify-between">
          <Text className="text-4xl font-bold tracking-tight text-foreground">
            Slice
          </Text>
          <TabProfileButton />
        </View>

        <View
          className="flex-1 py-6 px-5"
          style={{ paddingBottom: bottomPadding }}
        >
          <View className="gap-4">
            <AmountBillboard amount={amount} shakeTrigger={shakeTrigger} />
          </View>

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
            {/* Ghost button: fades (dim) under gradient when no amount; fades out when overlay is active */}
            <Animated.View
              style={ghostStyle}
              pointerEvents={hasAmount ? "none" : "auto"}
            >
              <SliceCTAButton isEnabled={false} onPress={() => {}} />
            </Animated.View>
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
