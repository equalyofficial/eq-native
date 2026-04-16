import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCSSVariable } from "uniwind";

interface SliceCTAButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  isEnabled?: boolean;
}

export function SliceCTAButton({ onPress, isLoading, isEnabled = true }: SliceCTAButtonProps) {
  const bgColor = useCSSVariable("--color-background");
  const fgColor = useCSSVariable("--color-foreground");

  return (
    <View style={[
      styles.shadowContainer, 
      { shadowColor: String(fgColor) }
    ]}>
      <Pressable
        onPress={onPress}
        disabled={isLoading || !isEnabled}
        className={`mx-6 mb-3 py-4 rounded-full items-center justify-center flex-row gap-2 active:opacity-90 transition-all ${
          isEnabled ? "bg-foreground opacity-100" : "bg-muted opacity-50"
        }`}
      >
        <Text className={`font-semibold text-lg ${isEnabled ? "text-background" : "text-foreground/50"}`}>
          Continue
        </Text>
        <Feather name="arrow-right" size={20} color={String(bgColor)} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    zIndex: 9999,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
